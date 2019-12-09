import { ModuleName, BigNumber, isUSDTieredSTO_3_1_0 } from '@polymathnetwork/contract-wrappers';
import { sortBy, toUpper, isEqual, range } from 'lodash';
import { Procedure } from './Procedure';
import {
  ProcedureType,
  PolyTransactionTag,
  ErrorCode,
  ModifyTieredStoDataProcedureArgs,
  StoType,
  Currency,
  StoTier,
} from '../types';
import { PolymathError } from '../PolymathError';
import { areSameAddress } from '../utils';
import { SecurityToken, TieredSto } from '../entities';
import { TieredStoFactory } from '../entities/factories';

const createRefreshResolver = (
  tieredStoFactory: TieredStoFactory,
  addedTransactions: PolyTransactionTag[],
  tag: PolyTransactionTag,
  securityTokenId: string,
  stoAddress: string
) => async () => {
  // refresh will only be called once at the last transaction
  if (addedTransactions[addedTransactions.length - 1] === tag) {
    return tieredStoFactory.refresh(
      TieredSto.generateId({ securityTokenId, stoType: StoType.Tiered, address: stoAddress })
    );
  }
};

export class ModifyTieredStoData extends Procedure<ModifyTieredStoDataProcedureArgs> {
  public type = ProcedureType.ModifyTieredStoData;

  public async prepareTransactions() {
    const { args, context } = this;
    const {
      symbol,
      stoAddress,
      startDate,
      endDate,
      tiers,
      nonAccreditedInvestmentLimit,
      minimumInvestment,
      currencies,
      raisedFundsWallet,
      unsoldTokensWallet,
      stableCoinAddresses,
    } = args;
    const {
      contractWrappers,
      factories: { tieredStoFactory },
    } = context;

    try {
      await contractWrappers.tokenFactory.getSecurityTokenInstanceFromTicker(symbol);
    } catch (err) {
      throw new PolymathError({
        code: ErrorCode.ProcedureValidationError,
        message: `There is no Security Token with symbol ${symbol}`,
      });
    }

    const stoModule = await contractWrappers.moduleFactory.getModuleInstance({
      name: ModuleName.UsdTieredSTO,
      address: stoAddress,
    });

    if (!stoModule) {
      throw new PolymathError({
        code: ErrorCode.ProcedureValidationError,
        message: `STO ${stoAddress} is either archived or hasn't been launched`,
      });
    }

    const [
      storageWallet,
      treasuryWallet,
      numberOfTiers,
      usdTokens,
      minInvestment,
      investmentLimit,
      { isRaisedInETH, isRaisedInPOLY, isRaisedInSC, startTime, endTime },
    ] = await Promise.all([
      stoModule.wallet(),
      contractWrappers.getTreasuryWallet({ module: stoModule }),
      stoModule.getNumberOfTiers(),
      stoModule.getUsdTokens(),
      stoModule.minimumInvestmentUSD(),
      stoModule.nonAccreditedLimitUSD(),
      stoModule.getSTODetails(),
    ]);

    // STO can't have started
    if (startTime <= new Date()) {
      throw new PolymathError({
        code: ErrorCode.ProcedureValidationError,
        message: 'Cannot modify STO data: STO has already started',
      });
    }

    // list of added transactions to keep track of the last added tx in order to refresh the entity only once
    const addedTransactions: PolyTransactionTag[] = [];
    const securityTokenId = SecurityToken.generateId({ symbol });

    if (startDate !== startTime || endDate !== endTime) {
      const tag = PolyTransactionTag.ModifyTimes;
      addedTransactions.push(tag);
      await this.addTransaction(stoModule.modifyTimes, {
        tag,
        resolvers: [
          createRefreshResolver(
            tieredStoFactory,
            addedTransactions,
            tag,
            securityTokenId,
            stoAddress
          ),
        ],
      })({ startTime: startDate, endTime: endDate });
    }

    const areSameCurrencies =
      (!isRaisedInETH || !!currencies.find(cur => cur === Currency.ETH)) &&
      (!isRaisedInPOLY || !!currencies.find(cur => cur === Currency.POLY)) &&
      (!isRaisedInSC || !!currencies.find(cur => cur === Currency.StableCoin));

    if (areSameCurrencies) {
      const tag = PolyTransactionTag.ModifyFunding;
      addedTransactions.push(tag);
      await this.addTransaction(stoModule.modifyFunding, {
        tag,
        resolvers: [
          createRefreshResolver(
            tieredStoFactory,
            addedTransactions,
            tag,
            securityTokenId,
            stoAddress
          ),
        ],
      })({ fundRaiseTypes: currencies });
    }

    let assembledTiers: StoTier[];
    let rawTiers;

    // this is needed because the return types of `tier` are different in the two versions
    // even if the properties used here are the same for both
    if (isUSDTieredSTO_3_1_0(stoModule)) {
      rawTiers = await Promise.all(range(numberOfTiers).map(tier => stoModule.tiers({ tier })));
      assembledTiers = rawTiers.map(
        ({ tokenTotal, rate, tokensDiscountPoly, rateDiscountPoly }) => ({
          tokensOnSale: tokenTotal,
          price: rate,
          tokensWithDiscount: tokensDiscountPoly,
          discountedPrice: rateDiscountPoly,
        })
      );
    } else {
      rawTiers = await Promise.all(range(numberOfTiers).map(tier => stoModule.tiers({ tier })));
      assembledTiers = rawTiers.map(
        ({ tokenTotal, rate, tokensDiscountPoly, rateDiscountPoly }) => ({
          tokensOnSale: tokenTotal,
          price: rate,
          tokensWithDiscount: tokensDiscountPoly,
          discountedPrice: rateDiscountPoly,
        })
      );
    }

    const areSameTiers = isEqual(tiers, assembledTiers);

    if (!areSameTiers) {
      const tokensPerTierTotal: BigNumber[] = [];
      const tokensPerTierDiscountPoly: BigNumber[] = [];
      const ratePerTier: BigNumber[] = [];
      const ratePerTierDiscountPoly: BigNumber[] = [];

      tiers.forEach(({ tokensOnSale, tokensWithDiscount, price, discountedPrice }) => {
        tokensPerTierTotal.push(tokensOnSale);
        tokensWithDiscount && tokensPerTierDiscountPoly.push(tokensWithDiscount);
        ratePerTier.push(price);
        discountedPrice && ratePerTierDiscountPoly.push(discountedPrice);
      });

      const tag = PolyTransactionTag.ModifyTiers;
      addedTransactions.push(tag);
      await this.addTransaction(stoModule.modifyTiers, {
        tag,
        resolvers: [
          createRefreshResolver(
            tieredStoFactory,
            addedTransactions,
            tag,
            securityTokenId,
            stoAddress
          ),
        ],
      })({ ratePerTier, tokensPerTierTotal, tokensPerTierDiscountPoly, ratePerTierDiscountPoly });
    }

    if (
      !minimumInvestment.isEqualTo(minInvestment) ||
      !nonAccreditedInvestmentLimit.isEqualTo(investmentLimit)
    ) {
      const tag = PolyTransactionTag.ModifyLimits;
      addedTransactions.push(tag);
      await this.addTransaction(stoModule.modifyLimits, {
        tag,
        resolvers: [
          createRefreshResolver(
            tieredStoFactory,
            addedTransactions,
            tag,
            securityTokenId,
            stoAddress
          ),
        ],
      })({
        minimumInvestmentUSD: minimumInvestment,
        nonAccreditedLimitUSD: nonAccreditedInvestmentLimit,
      });
    }

    const areSameStablecoins = isEqual(
      sortBy(stableCoinAddresses.map(toUpper)),
      sortBy(usdTokens.map(toUpper))
    );

    if (
      !areSameAddress(storageWallet, raisedFundsWallet) ||
      !areSameAddress(treasuryWallet, unsoldTokensWallet) ||
      !areSameStablecoins
    ) {
      const tag = PolyTransactionTag.ModifyAddresses;
      addedTransactions.push(tag);
      await this.addTransaction(stoModule.modifyAddresses, {
        tag,
        resolvers: [
          createRefreshResolver(
            tieredStoFactory,
            addedTransactions,
            tag,
            securityTokenId,
            stoAddress
          ),
        ],
      })({
        treasuryWallet: unsoldTokensWallet,
        wallet: raisedFundsWallet,
        usdTokens: stableCoinAddresses,
      });
    }

    if (addedTransactions.length === 0) {
      throw new PolymathError({
        code: ErrorCode.ProcedureValidationError,
        message: 'Modify STO data failed: nodthing to modify',
      });
    }
  }
}
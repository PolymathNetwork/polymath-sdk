import { BigNumber, ModuleName } from '@polymathnetwork/contract-wrappers';
import { SubModule } from './SubModule';
import { DividendType, TaxWithholdingEntry, ErrorCode } from '../../types';
import {
  EnableDividendManagers,
  CreateErc20DividendDistribution,
  CreateEtherDividendDistribution,
  UpdateDividendsTaxWithholdingList,
  SetDividendsWallet,
} from '../../procedures';
import { Checkpoint } from '../Checkpoint';
import { PolymathError } from '../../PolymathError';
import { DividendDistribution } from '../DividendDistribution';
import { DividendsManager } from '../DividendsManager';
import { Erc20DividendsManager } from '../Erc20DividendsManager';
import { EthDividendsManager } from '../EthDividendsManager';
import { TaxWithholding } from '../TaxWithholding';

interface GetManager {
  (args: { dividendType: DividendType.Erc20 }): Promise<Erc20DividendsManager | null>;
  (args: { dividendType: DividendType.Eth }): Promise<EthDividendsManager | null>;
  (args: string): Promise<DividendsManager | null>;
}

export class Dividends extends SubModule {
  /**
   * Enable dividend functionalities (ERC20, ETH or both)
   *
   * @param storageWalletAddress wallet that will receive reclaimed dividends and withheld taxes
   * @param types array containing the types of dividends to enable (will enable both if not present)
   */
  public enable = async (args: { storageWalletAddress: string; types?: DividendType[] }) => {
    const { symbol } = this.securityToken;
    const procedure = new EnableDividendManagers(
      {
        symbol,
        ...args,
      },
      this.context
    );
    return await procedure.prepare();
  };

  /**
   * Distribute dividends in POLY
   *
   * @param checkpointId uuid of the checkpoint to use as reference for the distribution
   * @param maturityDate date from which dividends can be paid/collected
   * @param expiryDate date up to which dividends can be paid/collected
   * @param amount amount to be distributed
   * @param name human readable name of the distribution
   * @param excludedAddresses shareholder addresses that will be excluded from the distribution (optional)
   * @param taxWithholdings array that specifies how much to withhold from each shareholder for tax purposes
   * @param taxWithholdings[].address shareholder address
   * @param taxWithholdings[].percentage tax percentage to be withheld
   */
  public createPolyDistribution = async (args: {
    checkpointId: string;
    maturityDate: Date;
    expiryDate: Date;
    amount: BigNumber;
    name: string;
    excludedAddresses?: string[];
    taxWithholdings?: TaxWithholdingEntry[];
  }) => {
    const polyAddress = await this.context.contractWrappers.polyToken.address();
    const { checkpointId, ...rest } = args;
    const { symbol } = this.securityToken;
    const { index: checkpointIndex } = Checkpoint.unserialize(checkpointId);
    const procedure = new CreateErc20DividendDistribution(
      {
        erc20Address: polyAddress,
        symbol,
        checkpointIndex,
        ...rest,
      },
      this.context
    );

    return await procedure.prepare();
  };

  /**
   * Distribute dividends in a specified ERC20 token
   *
   * @param checkpointId uuid of the checkpoint to use as reference for the distribution
   * @param maturityDate date from which dividends can be paid/collected
   * @param expiryDate date up to which dividends can be paid/collected
   * @param erc20Address address of the ERC20 token that will be used as currency
   * @param amount amount to be distributed
   * @param name human readable name of the distribution
   * @param excludedAddresses shareholder addresses that will be excluded from the distribution (optional)
   * @param taxWithholdings array that specifies how much to withhold from each shareholder for tax purposes
   * @param taxWithholdings[].address shareholder address
   * @param taxWithholdings[].percentage tax percentage to be withheld
   */
  public createErc20Distribution = async (args: {
    checkpointId: string;
    maturityDate: Date;
    expiryDate: Date;
    erc20Address: string;
    amount: BigNumber;
    name: string;
    excludedAddresses?: string[];
    taxWithholdings?: TaxWithholdingEntry[];
  }) => {
    const { checkpointId, ...rest } = args;
    const { symbol } = this.securityToken;
    const { index: checkpointIndex } = Checkpoint.unserialize(checkpointId);
    const procedure = new CreateErc20DividendDistribution(
      {
        symbol,
        checkpointIndex,
        ...rest,
      },
      this.context
    );
    return await procedure.prepare();
  };

  /**
   * Distribute dividends in ETH
   *
   * @param checkpointId uuid of the checkpoint to use as reference for the distribution
   * @param maturityDate date from which dividends can be paid/collected
   * @param expiryDate date up to which dividends can be paid/collected
   * @param amount amount to be distributed
   * @param name human readable name of the distribution
   * @param excludedAddresses shareholder addresses that will be excluded from the distribution (optional)
   * @param taxWithholdings array that specifies how much to withhold from each shareholder for tax purposes
   * @param taxWithholdings[].address shareholder address
   * @param taxWithholdings[].percentage tax percentage to be withheld
   */
  public createEthDistribution = async (args: {
    checkpointId: string;
    maturityDate: Date;
    expiryDate: Date;
    amount: BigNumber;
    name: string;
    excludedAddresses?: string[];
    taxWithholdings?: TaxWithholdingEntry[];
  }) => {
    const { checkpointId, ...rest } = args;
    const { symbol } = this.securityToken;
    const { index: checkpointIndex } = Checkpoint.unserialize(checkpointId);
    const procedure = new CreateEtherDividendDistribution(
      {
        symbol,
        checkpointIndex,
        ...rest,
      },
      this.context
    );
    return await procedure.prepare();
  };

  /**
   * Set default tax withtholding list for a type of dividends
   *
   * @param dividendType type of dividends for which to modify the tax withholding list
   * @param taxWithholdings array that specifies how much to withhold from each shareholder for tax purposes
   * @param taxWithholdings[].address shareholder address
   * @param taxWithholdings[].percentage tax percentage to be withheld
   */
  public modifyTaxWithholdingList = async (args: {
    dividendType: DividendType;
    taxWithholdings: TaxWithholdingEntry[];
  }) => {
    const { taxWithholdings, ...rest } = args;
    const { symbol } = this.securityToken;
    const shareholderAddresses: string[] = [];
    const percentages: number[] = [];
    taxWithholdings.forEach(({ address, percentage }) => {
      shareholderAddresses.push(address);
      percentages.push(percentage);
    });
    const procedure = new UpdateDividendsTaxWithholdingList(
      {
        symbol,
        shareholderAddresses,
        percentages,
        ...rest,
      },
      this.context
    );
    return await procedure.prepare();
  };

  /**
   * Change dividends manager storage wallet address
   *
   * @param dividendType type of dividends for which to modify the storage wallet
   * @param address new storage wallet address
   */
  public modifyStorageWallet = async (args: { dividendType: DividendType; address: string }) => {
    const { symbol } = this.securityToken;
    const procedure = new SetDividendsWallet(
      {
        symbol,
        ...args,
      },
      this.context
    );
    return await procedure.prepare();
  };

  /**
   * Retrieve a list of investor addresses and their corresponding tax withholding
   * percentages
   */
  public getTaxWithholdingList = async (args: { dividendType: DividendType }) => {
    const {
      contractWrappers: { tokenFactory, getAttachedModules },
    } = this.context;

    const { dividendType } = args;
    const { symbol, uid: securityTokenId } = this.securityToken;

    let securityToken;

    try {
      securityToken = await tokenFactory.getSecurityTokenInstanceFromTicker(symbol);
    } catch (err) {
      throw new PolymathError({
        code: ErrorCode.FetcherValidationError,
        message: `There is no Security Token with symbol ${symbol}`,
      });
    }

    let dividendsModule;
    if (dividendType === DividendType.Erc20) {
      dividendsModule = (await getAttachedModules(
        { symbol, moduleName: ModuleName.ERC20DividendCheckpoint },
        { unarchived: true }
      ))[0];
    } else if (dividendType === DividendType.Eth) {
      dividendsModule = (await getAttachedModules(
        { symbol, moduleName: ModuleName.EtherDividendCheckpoint },
        { unarchived: true }
      ))[0];
    }

    if (!dividendsModule) {
      throw new PolymathError({
        code: ErrorCode.FetcherValidationError,
        message:
          "Dividends of the specified type haven't been enabled. Did you forget to call dividends.enable() on your Security Token?",
      });
    }

    const checkpointIndex = await securityToken.currentCheckpointId();

    const checkpointData = await dividendsModule.getCheckpointData({
      checkpointId: checkpointIndex.toNumber(),
    });

    return checkpointData.map(
      ({ investor, withheld }) =>
        new TaxWithholding({
          investorAddress: investor,
          percentage: withheld.toNumber(),
          securityTokenSymbol: symbol,
          securityTokenId,
          dividendType,
        })
    );
  };

  /**
   * Retrieve all dividend distributions at a certain checkpoint
   *
   * @param checkpointId UUID of the checkpoint
   */
  public getDistributions = async (
    args: {
      checkpointId: string;
    },
    opts?: { dividendTypes?: DividendType[] }
  ) => {
    const { contractWrappers } = this.context;
    const { checkpointId } = args;

    const { symbol, uid: securityTokenId } = this.securityToken;

    const { index: checkpointIndex } = Checkpoint.unserialize(checkpointId);

    let dividendTypes: DividendType[] | undefined;

    if (opts) {
      ({ dividendTypes } = opts);
    }

    const checkpointDividends = await contractWrappers.getAllDividends({
      securityTokenSymbol: symbol,
      checkpointId: checkpointIndex,
      dividendTypes,
    });

    const dividends = checkpointDividends.map(
      dividend =>
        new DividendDistribution(
          {
            ...dividend,
            checkpointId,
            securityTokenSymbol: symbol,
            securityTokenId,
          },
          this.context
        )
    );

    return dividends;
  };

  /**
   * Retrieve a particular dividend distribution by type and index or UUID
   *
   * @param dividendType type of the dividend distribution
   * @param dividendIndex index of the dividend distribution
   */
  public getDistribution = async (
    args:
      | {
          dividendType: DividendType;
          dividendIndex: number;
        }
      | string
  ) => {
    let dividendType: DividendType;
    let dividendIndex: number;

    // fetch by UUID
    if (typeof args === 'string') {
      ({ index: dividendIndex, dividendType } = DividendDistribution.unserialize(args));
    } else {
      ({ dividendType, dividendIndex } = args);
    }

    const { securityToken } = this;

    const checkpoints = await securityToken.shareholders.getCheckpoints();

    for (const checkpoint of checkpoints) {
      const { dividends } = checkpoint;

      const result = dividends.find(
        dividend => dividend.index === dividendIndex && dividend.dividendType === dividendType
      );

      if (result) {
        return result;
      }
    }

    throw new PolymathError({
      code: ErrorCode.FetcherValidationError,
      message: 'There is no Dividend Distribution of the specified type with that index',
    });
  };

  /**
   * Retrieve a Dividends Manager related to the Security Token by UUID or type.
   * Returns null if dividends of that type haven't been enabled
   *
   * @param dividendType type of manager
   */
  public getManager: GetManager = async (
    args:
      | {
          dividendType: DividendType;
        }
      | string
  ) => {
    const { contractWrappers } = this.context;

    let dividendType: DividendType;

    // fetch by UUID
    if (typeof args === 'string') {
      ({ dividendType } = DividendsManager.unserialize(args));
    } else {
      ({ dividendType } = args);
    }

    const { symbol, uid: securityTokenId } = this.securityToken;

    const constructorData = {
      securityTokenSymbol: symbol,
      securityTokenId,
    };

    let dividendsModule;

    switch (dividendType) {
      case DividendType.Erc20: {
        dividendsModule = (await contractWrappers.getAttachedModules(
          { symbol, moduleName: ModuleName.ERC20DividendCheckpoint },
          { unarchived: true }
        ))[0];

        if (dividendsModule) {
          const storageWalletAddress = await dividendsModule.wallet();
          return new Erc20DividendsManager({
            address: await dividendsModule.address(),
            storageWalletAddress,
            ...constructorData,
          });
        }

        break;
      }
      case DividendType.Erc20: {
        dividendsModule = (await contractWrappers.getAttachedModules(
          { symbol, moduleName: ModuleName.EtherDividendCheckpoint },
          { unarchived: true }
        ))[0];

        if (dividendsModule) {
          const storageWalletAddress = await dividendsModule.wallet();
          return new EthDividendsManager({
            address: await dividendsModule.address(),
            storageWalletAddress,
            ...constructorData,
          });
        }

        break;
      }
      default: {
        throw new PolymathError({
          code: ErrorCode.FetcherValidationError,
          message: 'Invalid dividend type. Must be "Erc20" or "Eth".',
        });
      }
    }

    return null;
  };
}
import { TransactionObject } from 'web3/eth/types';
import BigNumber from 'bignumber.js';
import { SecurityTokenRegistryAbi } from './abis/SecurityTokenRegistryAbi';
import { Contract } from './Contract';
import { SecurityToken } from './SecurityToken';
import { Context } from './LowLevel';
import {
  GenericContract,
  RegisterTickerArgs,
  GenerateSecurityTokenArgs,
  GetSecurityTokenArgs,
  GetTickerDetailsArgs,
  IsTickerAvailableArgs,
  TickerDetails,
} from './types';
import { fromWei } from './utils';
import { PolymathError } from '../PolymathError';
import { ErrorCodes } from '../types';

interface SecurityTokenRegistryContract extends GenericContract {
  methods: {
    registerTicker(
      owner: string,
      ticker: string,
      tokenName: string
    ): TransactionObject<void>;
    getTickerDetails(ticker: string): TransactionObject<TickerDetails>;
    getTickerRegistrationFee(): TransactionObject<string>;
    getSecurityTokenLaunchFee(): TransactionObject<string>;
    getSecurityTokenAddress(ticker: string): TransactionObject<string>;
    generateSecurityToken(
      name: string,
      ticker: string,
      tokenDetails: string,
      divisible: boolean
    ): TransactionObject<void>;
  };
}

export class SecurityTokenRegistry extends Contract<
  SecurityTokenRegistryContract
> {
  constructor({ address, context }: { address: string; context: Context }) {
    super({ address, abi: SecurityTokenRegistryAbi.abi, context });
  }

  public registerTicker = async ({
    owner,
    ticker,
    tokenName,
  }: RegisterTickerArgs) => {
    return () =>
      this.contract.methods
        .registerTicker(owner, ticker, tokenName)
        .send({ from: this.context.account });
  };

  public getTickerDetails = async ({ ticker }: GetTickerDetailsArgs) => {
    const details = await this.contract.methods
      .getTickerDetails(ticker)
      .call({ from: this.context.account });

    return details;
  };

  /**
   * While lacking a public, smart contract function to check for ticker availability, this function attempts to
   * immitate the internal function SecurityTokenRegistry._tickerAvailable()
   * @see https://github.com/PolymathNetwork/polymath-core/blob/aa635df01588f733ce95bc13fe319c7d3c858a24/contracts/SecurityTokenRegistry.sol#L318
   */
  public isTickerAvailable = async ({
    ticker,
  }: IsTickerAvailableArgs): Promise<boolean> => {
    try {
      const {
        0: owner,
        2: expiryDate,
        4: status,
      } = await this.getTickerDetails({ ticker });
      const intExpiryDate = parseInt(expiryDate);
      if (owner !== '0x0000000000000000000000000000000000000000') {
        if (Date.now() > intExpiryDate * 1000 && !status) {
          return true;
        }
        return false;
      }

      return true;
    } catch (error) {
      throw new PolymathError({ code: ErrorCodes.UnexpectedReturnData });
    }
  };

  public generateSecurityToken = async ({
    tokenName,
    ticker,
    tokenDetails,
    divisible,
  }: GenerateSecurityTokenArgs) => {
    return () =>
      this.contract.methods
        .generateSecurityToken(tokenName, ticker, tokenDetails, divisible)
        .send({ from: this.context.account });
  };

  public async getTickerRegistrationFee() {
    const feeRes = await this.contract.methods
      .getTickerRegistrationFee()
      .call();
    return fromWei(feeRes);
  }

  public async getSecurityTokenLaunchFee() {
    const feeRes = await this.contract.methods
      .getSecurityTokenLaunchFee()
      .call();
    return fromWei(feeRes);
  }

  public async getSecurityToken({ ticker }: GetSecurityTokenArgs) {
    const address = await this.contract.methods
      .getSecurityTokenAddress(ticker)
      .call();

    return new SecurityToken({ address, context: this.context });
  }
}

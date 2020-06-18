import {
  BigNumber,
  FundRaiseType as Currency,
  ContractVersion as Version,
  ModuleName,
  PolyResponse,
  TransactionReceiptWithDecodedLogs,
} from '@polymathnetwork/contract-wrappers';
import { isPlainObject } from 'lodash';
import { PostTransactionResolver } from '../PostTransactionResolver';

/*
 * External Types
 */

export { Currency };

export { Version };

/**
 * Status of a Tokenholder in regards to a Dividend Distribution
 */
export interface DividendTokenholderStatus {
  /**
   * wallet address of the Tokenholder
   */
  address: string;
  /**
   * whether the Tokenholder has received payment
   */
  paymentReceived: boolean;
  /**
   * whether the Tokenholder is excluded from the Dividend distribution
   */
  excluded: boolean;
  /**
   * amount of tokens withheld for tax purposes
   */
  withheldTax: BigNumber;
  /**
   * the amount of tokens the Tokenholder has received as Dividend payment
   */
  amountReceived: BigNumber;
  /**
   * the balance of the Tokenholder
   */
  balance: BigNumber;
}

export enum StoType {
  Simple = 'Simple',
  Tiered = 'Tiered',
}

/**
 * Check if the argument is of type [[STOType]]
 */
export function isStoType(type: any): type is StoType {
  return typeof type === 'string' && (type === StoType.Tiered || type === StoType.Simple);
}

/**
 * Properties denoting a Tokenholder's Tax Withholding Percentage
 */
export interface TaxWithholdingEntry {
  /**
   * wallet address of the Tokenholder
   */
  address: string;
  /**
   * percentage of the Tokenholder's Dividend payments that will be withheld for tax
   */
  percentage: number;
}

/**
 * Specifies how many tokens to issue and who to issue them to
 */
export interface IssuanceDataEntry {
  /**
   * wallet address where Tokens will be received
   */
  address: string;
  /**
   * amount of tokens to be issued
   */
  amount: BigNumber;
  /**
   * KYC data for the Tokenholder
   */
  tokenholderData?: Omit<TokenholderDataEntry, 'address'>;
}

/**
 * Specifies possible types of errors in the SDK
 */
export enum ErrorCode {
  IncompatibleBrowser = 'IncompatibleBrowser',
  FeatureNotEnabled = 'FeatureNotEnabled',
  NonBrowserEnvironment = 'NonBrowserEnvironment',
  MetamaskNotInstalled = 'MetamaskNotInstalled',
  UserDeniedAccess = 'UserDeniedAccess',
  WalletIsLocked = 'WalletIsLocked',
  ProcedureValidationError = 'ProcedureValidationError',
  FetcherValidationError = 'FetcherValidationError',
  TransactionRejectedByUser = 'TransactionRejectedByUser',
  TransactionReverted = 'TransactionReverted',
  FatalError = 'FatalError',
  UnexpectedReturnData = 'UnexpectedReturnData',
  UnexpectedEventLogs = 'UnexpectedEventLogs',
  InvalidUuid = 'InvalidUuid',
  InvalidAddress = 'InvalidAddress',
  InsufficientBalance = 'InsufficientBalance',
  InexistentModule = 'InexistentModule',
  IncorrectVersion = 'IncorrectVersion',
}

/**
 * Balance in Security Tokens of a specific Tokenholder
 */
export interface TokenholderBalance {
  /**
   * wallet address of the Tokenholder
   */
  address: string;
  /**
   * amount of Security Tokens the Tokenholder possesses
   */
  balance: BigNumber;
}

/**
 * Types of Procedures available in the SDK
 */
export enum ProcedureType {
  UnnamedProcedure = 'UnnamedProcedure',
  ApproveErc20 = 'ApproveErc20',
  TransferErc20 = 'TransferErc20',
  CreateCheckpoint = 'CreateCheckpoint',
  EnableDividendManager = 'EnableDividendManager',
  EnableGeneralPermissionManager = 'EnableGeneralPermissionManager',
  EnableGeneralTransferManager = 'EnableGeneralTransferManager',
  EnableCountTransferManager = 'EnableCountTransferManager',
  EnablePercentageTransferManager = 'EnablePercentageTransferManager',
  LaunchSimpleSto = 'LaunchSimpleSto',
  LaunchTieredSto = 'LaunchTieredSto',
  CreateDividendDistribution = 'CreateDividendDistribution',
  CreateSecurityToken = 'CreateSecurityToken',
  DisableFeature = 'DisableFeature',
  FreezeIssuance = 'FreezeIssuance',
  ReclaimFunds = 'ReclaimFunds',
  ReserveSecurityToken = 'ReserveSecurityToken',
  WithdrawTaxes = 'WithdrawTaxes',
  UpdateDividendsTaxWithholdingList = 'UpdateDividendsTaxWithholdingList',
  SetDividendsWallet = 'SetDividendsWallet',
  PushDividendPayment = 'PushDividendPayment',
  PullDividendPayment = 'PullDividendPayment',
  ModifyDividendsDefaultExclusionList = 'ModifyDividendsDefaultExclusionList',
  AssignSecurityTokenRole = 'AssignSecurityTokenRole',
  AssignStoRole = 'AssignStoRole',
  ControllerTransfer = 'ControllerTransfer',
  ControllerRedeem = 'ControllerRedeem',
  TogglePauseSto = 'PauseSto',
  FinalizeSto = 'FinalizeSto',
  SetController = 'SetController',
  SetDocument = 'SetDocument',
  RemoveDocument = 'RemoveDocument',
  DisableController = 'DisableController',
  ModifyTokenholderData = 'ModifyTokenholderData',
  RevokeKyc = 'RevokeKyc',
  IssueTokens = 'IssueTokens',
  ToggleAllowPreIssuing = 'ToggleAllowPreIssuing',
  ToggleAllowBeneficialInvestments = 'ToggleAllowBeneficialInvestments',
  ModifyTieredStoData = 'ModifyTieredStoData',
  InvestInTieredSto = 'InvestInTieredSto',
  InvestInSimpleSto = 'InvestInSimpleSto',
  ModifyMaxHolderCount = 'ModifyMaxHolderCount',
  ModifyMaxHolderPercentage = 'ModifyMaxHolderPercentage',
  ModifyPercentageExemptions = 'ModifyPercentageExemptions',
  TransferSecurityTokens = 'TransferSecurityTokens',
  ToggleFreezeTransfers = 'ToggleFreezeTransfers',
  SignTransferData = 'SignTransferData',
  SignDisableControllerAck = 'SignDisableControllerAck',
  SignFreezeIssuanceAck = 'SignFreezeIssuanceAck',
  TransferOwnership = 'TransferOwnership',
  TransferReservationOwnership = 'TransferReservationOwnership',
}

/**
 * Tag to distinguish transactions for display purposes
 */
export enum PolyTransactionTag {
  Any = 'Any',
  GetTokens = 'GetTokens',
  ApproveErc20 = 'ApproveErc20',
  TransferErc20 = 'TransferErc20',
  ReserveSecurityToken = 'ReserveSecurityToken',
  CreateSecurityToken = 'CreateSecurityToken',
  CreateCheckpoint = 'CreateCheckpoint',
  CreateErc20DividendDistribution = 'CreateErc20DividendDistribution',
  SetErc20TaxWithholding = 'SetErc20TaxWithholding',
  SetEtherTaxWithholding = 'SetEtherTaxWithholding',
  SetDefaultExcluded = 'SetDefaultExcluded',
  EnableDividends = 'EnableDividends',
  EnableCappedSto = 'EnableCappedSto',
  EnableTieredSto = 'EnableTieredSto',
  EnableGeneralPermissionManager = 'EnableGeneralPermissionManager',
  EnableGeneralTransferManager = 'EnableGeneralTransferManager',
  EnableCountTransferManager = 'EnableCountTransferManager',
  EnablePercentageTransferManager = 'EnablePercentageTransferManager',
  DisableController = 'DisableController',
  FreezeIssuance = 'FreezeIssuance',
  DisableFeature = 'DisableFeature',
  ReclaimDividendFunds = 'ReclaimDividendFunds',
  WithdrawTaxWithholdings = 'WithdrawTaxWithholdings',
  PushDividendPayment = 'PushDividendPayment',
  PullDividendPayment = 'PullDividendPayment',
  SetDividendsWallet = 'SetDividendsWallet',
  AddDelegate = 'AddDelegate',
  ChangePermission = 'ChangePermission',
  ControllerTransfer = 'ControllerTransfer',
  ControllerRedeem = 'ControllerRedeem',
  PauseSto = 'PauseSto',
  UnpauseSto = 'UnpauseSto',
  FinalizeSto = 'FinalizeSto',
  SetController = 'SetController',
  SetDocument = 'SetDocument',
  RemoveDocument = 'RemoveDocument',
  ModifyKycDataMulti = 'ModifyKycDataMulti',
  ModifyInvestorFlagMulti = 'ModifyInvestorFlagMulti',
  IssueMulti = 'IssueMulti',
  AllowPreMinting = 'AllowPreMinting',
  RevokePreMinting = 'RevokePreMinting',
  ChangeAllowBeneficialInvestments = 'ChangeAllowBeneficialInvestments',
  ModifyTimes = 'ModifyTimes',
  ModifyFunding = 'ModifyFunding',
  ModifyAddresses = 'ModifyAddresses',
  ModifyTiers = 'ModifiyTiers',
  ModifyLimits = 'ModifyLimits',
  ModifyOracles = 'ModifyOracles',
  BuyWithScRateLimited = 'BuyWithScRateLimited',
  BuyWithPolyRateLimited = 'BuyWithPolyRateLimited',
  BuyWithEthRateLimited = 'BuyWithEthRateLimited',
  BuyTokens = 'BuyTokens',
  BuyTokensWithPoly = 'BuyTokensWithPoly',
  ChangeHolderCount = 'ChangeHolderCount',
  ChangeHolderPercentage = 'ChangeHolderPercentage',
  ModifyWhitelistMulti = 'ModifyWhitelistMulti',
  SetAllowPrimaryIssuance = 'SetAllowPrimaryIssuance',
  TransferSecurityTokens = 'TransferSecurityTokens',
  UnfreezeTransfers = 'UnfreezeTransfers',
  FreezeTransfers = 'FreezeTransfers',
  Signature = 'Signature',
  TransferReservationOwnership = 'TransferReservationOwnership',
  TransferOwnership = 'TransferOwnership',
}

// TODO @monitz87: remake this interface when contract-wrappers exports the tx arguments
// export interface TransactionArguments {
//   [PolyTransactionTag.Any]: {};
//   [PolyTransactionTag.SetErc20TaxWithholding]: Partial<SetWithholdingArgs>;
//   [PolyTransactionTag.SetEtherTaxWithholding]: Partial<SetWithholdingArgs>;
//   [PolyTransactionTag.ReclaimDividendFunds]: Partial<ReclaimDividendArgs>;
//   [PolyTransactionTag.WithdrawTaxWithholdings]: Partial<WithdrawWithholdingArgs>;
//   [PolyTransactionTag.CreateErc20DividendDistribution]: Partial<CreateErc20DividendArgs>;
//   [PolyTransactionTag.GetTokens]: Partial<GetTokensArgs>;
//   [PolyTransactionTag.ApprovePoly]: Partial<ApproveArgs>;
//   [PolyTransactionTag.EnableDividends]: Partial<AddDividendsModuleArgs>;
//   [PolyTransactionTag.ReserveSecurityToken]: Partial<RegisterTickerArgs>;
//   [PolyTransactionTag.CreateSecurityToken]: Partial<GenerateNewSecurityTokenArgs>;
//   [PolyTransactionTag.PushDividendPayment]: Partial<PushDividendPaymentArgs>;
//   [PolyTransactionTag.SetDividendsWallet]: Partial<SetDividendsWalletArgs>;
//   [PolyTransactionTag.CreateCheckpoint]: {};
// }

// Procedure arguments

/**
 * Arguments for the [[ApproveErc20]] Procedure
 */
export interface ApproveErc20ProcedureArgs {
  /**
   * amount of tokens to be approved
   */
  amount: BigNumber;
  /**
   * the spender of the tokens being approved
   */
  spender: string;
  /**
   * address of the ERC20 token (defaults to POLY)
   */
  tokenAddress?: string;
}

/**
 * Arguments for the [[TransferErc20]] Procedure
 */
export interface TransferErc20ProcedureArgs {
  /**
   * amount of tokens to be transferred
   */
  amount: BigNumber;
  /**
   * the receiver of tokens being transferred
   */
  receiver: string;
  /**
   * address of the ERC20 token (defaults to POLY)
   */
  tokenAddress?: string;
}

/**
 * Arguments for the [[CreateCheckpoint]] Procedure
 */
export interface CreateCheckpointProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
}

/**
 * Arguments for the [[CreateDividendDistribution]] Procedure
 */
export interface CreateDividendDistributionProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * date from which Dividend payments can be pushed/claimed
   */
  maturityDate: Date;
  /**
   * date on which the Dividend will expire
   */
  expiryDate: Date;
  /**
   * address of the ERC20 token
   */
  erc20Address: string;
  /**
   * amount to be distributed as dividends
   */
  amount: BigNumber;
  /**
   * index of the Checkpoint in which the Dividend Distribution will be based
   */
  checkpointIndex: number;
  /**
   * name of the distribution
   */
  name: string;
  /**
   * list of addresses that will be excluded from receiving payment
   */
  excludedAddresses?: string[];
  /**
   * tax withholding list for the Dividend Distribution
   */
  taxWithholdings?: TaxWithholdingEntry[];
}

/**
 * Arguments for the [[PushDividendPayment]] Procedure
 */
export interface PushDividendPaymentProcedureArgs {
  /**
   * symbol of the security token
   */
  symbol: string;
  dividendIndex: number;
  /**
   * list of addresses of the Tokenholders that will receive payment
   */
  tokenholderAddresses?: string[];
}

/**
 * Arguments for the [[PullDividendPayment]] Procedure
 */
export interface PullDividendPaymentProcedureArgs {
  /**
   * symbol of the security token
   */
  symbol: string;
  dividendIndex: number;
}

/**
 * Arguments for the [[CreateSecurityToken]] Procedure
 */
export interface CreateSecurityTokenProcedureArgs {
  /**
   * name of the Security Token
   */
  name: string;
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * url where Security Token details can be found
   */
  detailsUrl?: string;
  /**
   * whether or not the Security Token is divisible
   */
  divisible: boolean;
  /**
   * the Treasury Wallet address
   */
  treasuryWallet?: string;
}

/**
 * Arguments for the [[EnableDividendManager]] Procedure
 */
export interface EnableDividendManagerProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * storage wallet where Dividends funds will be stored
   */
  storageWalletAddress: string;
}

/**
 * Arguments for the [[EnableGeneralPermissionManager]] Procedure
 */
export interface EnableGeneralPermissionManagerProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
}

/**
 * Arguments for the [[EnableGeneralTransferManager]] Procedure
 */
export interface EnableGeneralTransferManagerProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
}

/**
 * Arguments for the [[EnableCountTransferManager]] Procedure
 */
export interface EnableCountTransferManagerProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * maximum number of simultaneous token holders
   */
  maxHolderCount: number;
}

/**
 * Arguments for the [[EnablePercentageTransferManager]] Procedure
 */
export interface EnablePercentageTransferManagerProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * maximum percentage of the total supply a single token holder can hold
   */
  maxHolderPercentage: BigNumber;
  /**
   * whether primary issuance is exempted from percentage restrictions.
   * If true, issuing tokens to a wallet that doesn't own tokens will bypass percentage restrictions
   */
  allowPrimaryIssuance?: boolean;
  whitelistEntries?: PercentageWhitelistEntry[];
}

/**
 * Arguments for the [[DisableFeature]] Procedure
 */
export interface DisableFeatureProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * name of the Module that will be disabled
   */
  moduleName: ModuleName;
}

/**
 * Arguments for the [[LaunchSimpleSto]] Procedure
 */
export interface LaunchSimpleStoProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * start date of the STO
   */
  startDate: Date;
  /**
   * end date of the STO
   */
  endDate: Date;
  /**
   * number of tokens that will be sold
   */
  tokensOnSale: BigNumber;
  /**
   * amount of tokens sold per unit of currency
   */
  rate: BigNumber;
  /**
   * currency for the Simple STO fund raise
   */
  currency: Currency.ETH | Currency.POLY;
  /**
   * wallet to which raised funds will be sent
   */
  raisedFundsWallet: string;
  /**
   * wallet to which unsold tokens will be sent if the STO expires
   */
  unsoldTokensWallet: string;
  /**
   * whether the total amount of Security Tokens that will be sold should be issued at the time the STO starts.
   * Otherwise, they will be issued on each purchase. Defaults to false
   */
  allowPreIssuing?: boolean;
}

/**
 * Arguments for the [[IssueTokens]] Procedure
 */
export interface IssueTokensProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * array of entries that specify who to issue tokens to and the amounts
   */
  issuanceData: IssuanceDataEntry[];
}

/**
 * Arguments for the [[ToggleAllowPreIssuing]] Procedure
 */
export interface ToggleAllowPreIssuingProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * address of the STO
   */
  stoAddress: string;
  /**
   * type of the STO (Simple, Tiered, etc)
   */
  stoType: StoType;
  /**
   * whether the total amount of Security Tokens that will be sold should be issued at the time the STO starts.
   * Otherwise, they will be issued on each purchase. Defaults to false
   */
  allowPreIssuing: boolean;
}

/**
 * Arguments for the [[ToggleAllowBeneficialInvestments]] Procedure
 */
export interface ToggleAllowBeneficialInvestmentsProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * address of the STO
   */
  stoAddress: string;
  /**
   * type of the STO (Simple, Tiered, etc)
   */
  stoType: StoType;
  /**
   * whether the STO allows investing on behalf of a beneficiary
   */
  allowBeneficialInvestments: boolean;
}

/**
 * Arguments for the [[ModifyTieredStoData]] Procedure
 */
export interface ModifyTieredStoDataProcedureArgs
  extends Partial<Omit<LaunchTieredStoProcedureArgs, 'allowPreIssuing'>> {
  /**
   * address of the STO
   */
  stoAddress: string;
  /**
   * symbol of the Security Token
   */
  symbol: string;
}

interface InvestInTieredStoBaseProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * address of the STO
   */
  stoAddress: string;
  /**
   * amount to invest
   */
  amount: BigNumber;
  /**
   * currency type in which the investment is being made
   */
  currency: Currency;
  /**
   * minimum amount of Security Tokens that should be bought.
   * If, because of price fluctuations, a lower amount is being bought, the transaction will revert
   */
  minTokens?: BigNumber;
  /**
   * if specified, the investment will be made on behalf of this address
   */
  beneficiary?: string;
}

export interface InvestWithStableCoinArgs extends InvestInTieredStoBaseProcedureArgs {
  currency: Currency.StableCoin;
  stableCoinAddress: string;
}

/**
 * Arguments for the [[InvestInTieredSto]] Procedure
 */
export type InvestInTieredStoProcedureArgs =
  | InvestInTieredStoBaseProcedureArgs & {
      /**
       * currency in which the investment is being made
       */
      currency: Currency.POLY | Currency.ETH;
      /**
       * stable coin ethereum address
       */
      stableCoinAddress?: undefined; // this is done this way on purpose for type safety
    }
  | InvestWithStableCoinArgs;

/**
 * Arguments for the [[InvestInSimpleSto]] Procedure
 */
export interface InvestInSimpleStoProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * address of the STO
   */
  stoAddress: string;
  /**
   * amount to invest
   */
  amount: BigNumber;
  /**
   * if specified, the investment will be made on behalf of this address
   */
  beneficiary?: string;
}

/**
 * Check whether the arguments are of type [[InvestWithStableCoinArgs]]
 */
export function isInvestWithStableCoinArgs(args: any): args is InvestWithStableCoinArgs {
  const { currency, stableCoinAddress } = args;

  return currency === Currency.StableCoin && typeof stableCoinAddress === 'string';
}

/**
 * Represents a tier of investment in a Tiered STO.
 * Different tiers can sell different Security Token amounts at different prices, and apply discounts when purchasing with POLY
 */
export interface StoTier {
  /**
   * Amount of tokens to sell in this tier
   */
  tokensOnSale: BigNumber;
  /**
   * Price of each token in this tier
   */
  price: BigNumber;
  /**
   * Amount of tokens to sell at a discount if paid in POLY.
   * Must be less than the amount of tokens on sale
   */
  tokensWithDiscount?: BigNumber;
  /**
   * Price of tokens sold at a discount
   */
  discountedPrice?: BigNumber;
}

/**
 * Custom currency in which a Tiered STO can raise funds
 */
export interface CustomCurrency {
  /**
   * symbol of the custom currency (USD, CAD, EUR, etc. Default is USD)
   */
  currencySymbol: string;
  /**
   * address of the oracle that states the price of ETH in the custom currency. Only required if raising funds in ETH
   */
  ethOracleAddress: string;
  /**
   * address of the oracle that states the price of POLY in the custom currency. Only required if raising funds in POLY
   */
  polyOracleAddress: string;
}

/**
 * Arguments for the [[LaunchTieredSto]] Procedure
 */
export interface LaunchTieredStoProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * start date of the STO
   */
  startDate: Date;
  /**
   * end date of the STO
   */
  endDate: Date;
  /**
   * array of Tier information
   */
  tiers: StoTier[];
  /**
   * maximum amount that can be invested by non accredited investors
   */
  nonAccreditedInvestmentLimit: BigNumber;
  /**
   * minimum amount that can be invested by any investor
   */
  minimumInvestment: BigNumber;
  /**
   * currencies with which Security Tokens can be purchased in the STO
   */
  currencies: Currency[];
  /**
   * wallet where raised funds will be sent
   */
  raisedFundsWallet: string;
  /**
   * wallet where unsold tokens will be sent if the STO expires
   */
  unsoldTokensWallet: string;
  /**
   * list of the addresses of the Stable Coins that can be used to purchase Security Tokens in the STO
   */
  stableCoinAddresses?: string[];
  /**
   * if raising in Stable Coin,
   * this parameter can be used to specify a currency different than USD for the STO to be pegged in
   */
  customCurrency?: Partial<CustomCurrency>;
  /**
   * whether the total amount of Security Tokens that will be sold should be issued at the time the STO starts.
   * Otherwise, they will be issued on each purchase. Defaults to false
   */
  allowPreIssuing?: boolean;
}

/**
 * Arguments for the [[ReclaimFunds]] Procedure
 */
export interface ReclaimFundsProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  dividendIndex: number;
}

/**
 * Arguments for the [[ReserveSecurityToken]] Procedure
 */
export interface ReserveSecurityTokenProcedureArgs {
  /**
   * the symbol to be reserved
   */
  symbol: string;
  /**
   * if supplied, the reservation will be made on behalf of this address
   */
  owner?: string;
}

/**
 * Arguments for the [[WithdrawTaxes]] Procedure
 */
export interface WithdrawTaxesProcedureArgs {
  /**
   * the symbol of the Security Token
   */
  symbol: string;
  dividendIndex: number;
}

/**
 * Arguments for the [[UpdateDividendsTaxWithholdingList]] Procedure
 */
export interface UpdateDividendsTaxWithholdingListProcedureArgs {
  /**
   * the symbol of the Security Token
   */
  symbol: string;
  /**
   * list of addresses of the Tokenholders for which to update the tax withholding percentages
   */
  tokenholderAddresses: string[];
  /**
   * list of percentages to update
   */
  percentages: number[];
}

/**
 * Arguments for the [[SetDividendsWallet]] Procedure
 */
export interface SetDividendsWalletProcedureArgs {
  /**
   * the symbol of the Security Token
   */
  symbol: string;
  /**
   * wallet address
   */
  address: string;
}

/**
 * Arguments for the [[ModifyDividendsDefaultExclusionList]] Procedure
 */
export interface ModifyDividendsDefaultExclusionListProcedureArgs {
  /**
   * the symbol of the Security Token
   */
  symbol: string;
  /**
   * list of addresses to conform the new default exclusion list.
   * Addresses in this list will not be considered for Dividend Distribution payments
   */
  tokenholderAddresses: string[];
}

/**
 * Arguments for the [[AssignSecurityTokenRole]] Procedure
 */
export interface AssignSecurityTokenRoleProcedureArgs {
  /**
   * the symbol of the Security Token
   */
  symbol: string;
  /**
   * wallet address of the delegate
   */
  delegateAddress: string;
  /**
   * role to assign/revoke to/from the delegate
   */
  role: SecurityTokenRole;
  /**
   * whether to assign or revoke the role
   */
  assign: boolean;
  /**
   * description of the delegate (i.e. "company accountant")
   */
  description: string;
}

/**
 * Arguments for the [[AssignStoRole]] Procedure
 */
export interface AssignStoRoleProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * wallet address of the delegate
   */
  delegateAddress: string;
  stoAddress: string;
  /**
   * role to assign/revoke to/from the delegate
   */
  role: StoRole;
  /**
   * whether to assign or revoke the role
   */
  assign: boolean;
  /**
   * description of the delegate (i.e. "company lawyer")
   */
  description?: string;
}

/**
 * Arguments for the [[ControllerTransfer]] Procedure
 */
export interface ControllerTransferProcedureArgs {
  /**
   * sender's wallet address
   */
  from: string;
  /**
   * receiver's wallet address
   */
  to: string;
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * amount of tokens being forcefully transferred
   */
  amount: BigNumber;
  /**
   * extra KYC transfer data
   */
  data?: string;
  /**
   * extra log information
   */
  log?: string;
}

/**
 * Arguments for the [[ControllerRedeem]] Procedure
 */
export interface ControllerRedeemProcedureArgs {
  /**
   * wallet address from which tokens will be redeemed (burned)
   */
  from: string;
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * amount of tokens being redeemed (burned)
   */
  amount: BigNumber;
  /**
   * extra KYC transfer data
   */
  data?: string;
  /**
   * reason why tokens are being redeemed
   */
  reason?: string;
}

/**
 * Arguments for the [[TogglePauseSto]] Procedure
 */
export interface TogglePauseStoProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  stoAddress: string;
  /**
   * type of the STO (Simple, Tiered, etc)
   */
  stoType: StoType;
  /**
   * true if pausing the STO, false if un-pausing it
   */
  pause: boolean;
}

/**
 * Arguments for the [[FinalizeSto]] Procedure
 */
export interface FinalizeStoProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  stoAddress: string;
  /**
   * type of the STO (Simple, Tiered, etc)
   */
  stoType: StoType;
}

/**
 * Arguments for the [[SetController]] Procedure
 */
export interface SetControllerProcedureArgs {
  /**
   * the symbol of the Security Token
   */
  symbol: string;
  /**
   * wallet address to be set as the Security Token's controller
   */
  controller: string;
}

/**
 * Arguments for the [[SetDocument]] Procedure
 */
export interface SetDocumentProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * name of the Document. Must be unique for the Security Token
   */
  name: string;
  uri: string;
  /**
   * hash of the contents of the Document
   */
  documentHash: string;
}

/**
 * Arguments for the [[RemoveDocument]] Procedure
 */
export interface RemoveDocumentProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * the name of the Document being removed
   */
  name: string;
}

/**
 * Arguments for the [[FreezeIssuance]] Procedure
 */
export interface FreezeIssuanceProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * acknowledgement signature
   */
  signature?: string;
}

/**
 * Arguments for the [[DisableController]] Procedure
 */
export interface DisableControllerProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * acknowledgement signature
   */
  signature?: string;
}

/**
 * Arguments for the [[TransferOwnership]] Procedure
 */
export interface TransferOwnershipProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * wallet address for the new Security Token owner
   */
  newOwner: string;
}

/**
 * Arguments for the [[TransferReservationOwnership]] Procedure
 */
export interface TransferReservationOwnershipProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * wallet address for the new symbol Reservation owner
   */
  newOwner: string;
}

/**
 * A Tokenholder's KYC data
 */
export interface TokenholderDataEntry {
  /**
   * tokenholder wallet address to whitelist
   */
  address: string;
  /**
   * date from which the tokenholder can transfer tokens
   */
  canSendAfter: Date;
  /**
   * date from which the tokenholder can receive tokens
   */
  canReceiveAfter: Date;
  /**
   * date at which the tokenholder's KYC expires
   */
  kycExpiry: Date;
  /**
   * whether the tokenholder is accredited
   */
  isAccredited: boolean;
  /**
   * whether the tokenholder is allowed to purchase tokens in an STO
   */
  canBuyFromSto: boolean;
}

/**
 * Arguments for the [[ModifyTokenholderData]] Procedure
 */
export interface ModifyTokenholderDataProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * tokenholder KYC data that will be added/modified
   */
  tokenholderData: TokenholderDataEntry[];
}

/**
 * Arguments for the [[RevokeKyc]] Procedure
 */
export interface RevokeKycProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * list of Tokenholders addresses for which KYC will be revoked
   */
  tokenholderAddresses: string[];
}

/**
 * Arguments for the [[ModifyMaxHolderCount]] Procedure
 */
export interface ModifyMaxHolderCountProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * maximum number of simultaneous token holders
   */
  maxHolderCount: number;
}

/**
 * Arguments for the [[ModifyMaxHolderPercentage]] Procedure
 */
export interface ModifyMaxHolderPercentageProcedureArgs {
  /**
   * the symbol of the Security Token
   */
  symbol: string;
  /**
   * maximum percentage of total tokens a single Tokenholder can hold
   */
  maxHolderPercentage: BigNumber;
}

/**
 * Entry that represents whether a Tokenholder is exempted from Percentage Restrictions
 */
export interface PercentageWhitelistEntry {
  /**
   * Tokenholder wallet address
   */
  address: string;
  /**
   * whether the address is whitelisted or not
   */
  whitelisted: boolean;
}

/**
 * Arguments for the [[ModifyPercentageExemptions]] Procedure
 */
export interface ModifyPercentageExemptionsProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * list of Tokenholders to add/remove to/from the whitelist
   */
  whitelistEntries?: PercentageWhitelistEntry[];
  /**
   * whether primary issuance is exempted from percentage restrictions.
   * If true, issuing tokens to a wallet that doesn't own tokens will bypass percentage restrictions
   */
  allowPrimaryIssuance?: boolean;
}

/**
 * Arguments for the [[TransferSecurityTokens]] Procedure
 */
export interface TransferSecurityTokensProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * wallet address receiving Security Tokens
   */
  to: string;
  /**
   * amount of tokens being transferred
   */
  amount: BigNumber;
  /**
   * signed KYC data that will be considered (and applied to the Security Token) when checking for transfer restrictions
   */
  data?: string;
  /**
   * wallet address sending Security Tokens. Defaults to the current wallet
   */
  from?: string;
}

/**
 * Arguments for the [[ToggleFreezeTransfers]] Procedure
 */
export interface ToggleFreezeTransfersProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * whether to freeze or un-freeze transfers
   */
  freeze: boolean;
}

/**
 * Arguments for the [[SignTransferData]] Procedure
 */
export interface SignTransferDataProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
  /**
   * KYC data to sign
   */
  kycData: Omit<Omit<TokenholderDataEntry, 'isAccredited'>, 'canBuyFromSto'>[];
  /**
   * date from which the signature is valid
   */
  validFrom: Date;
  /**
   * date until which the signature is valid
   */
  validTo: Date;
}

/**
 * Arguments for the [[SignDisableControllerAck]] Procedure
 */
export interface SignDisableControllerAckProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
}

/**
 * Arguments for the [[SignFreezeIssuanceAck]] Procedure
 */
export interface SignFreezeIssuanceAckProcedureArgs {
  /**
   * symbol of the Security Token
   */
  symbol: string;
}

/**
 * @hidden
 */
export interface ProcedureArguments {
  [ProcedureType.ApproveErc20]: ApproveErc20ProcedureArgs;
  [ProcedureType.TransferErc20]: TransferErc20ProcedureArgs;
  [ProcedureType.CreateCheckpoint]: CreateCheckpointProcedureArgs;
  [ProcedureType.CreateDividendDistribution]: CreateDividendDistributionProcedureArgs;
  [ProcedureType.CreateSecurityToken]: CreateSecurityTokenProcedureArgs;
  [ProcedureType.EnableDividendManager]: EnableDividendManagerProcedureArgs;
  [ProcedureType.EnableGeneralPermissionManager]: EnableGeneralPermissionManagerProcedureArgs;
  [ProcedureType.EnableGeneralTransferManager]: EnableGeneralTransferManagerProcedureArgs;
  [ProcedureType.EnableCountTransferManager]: EnableCountTransferManagerProcedureArgs;
  [ProcedureType.EnablePercentageTransferManager]: EnablePercentageTransferManagerProcedureArgs;
  [ProcedureType.ReclaimFunds]: ReclaimFundsProcedureArgs;
  [ProcedureType.ReserveSecurityToken]: ReserveSecurityTokenProcedureArgs;
  [ProcedureType.WithdrawTaxes]: WithdrawTaxesProcedureArgs;
  [ProcedureType.UpdateDividendsTaxWithholdingList]: UpdateDividendsTaxWithholdingListProcedureArgs;
  [ProcedureType.PushDividendPayment]: PushDividendPaymentProcedureArgs;
  [ProcedureType.PullDividendPayment]: PullDividendPaymentProcedureArgs;
  [ProcedureType.SetDividendsWallet]: SetDividendsWalletProcedureArgs;
  // prettier-ignore
  [ProcedureType.ModifyDividendsDefaultExclusionList]:
    ModifyDividendsDefaultExclusionListProcedureArgs;
  [ProcedureType.LaunchSimpleSto]: LaunchSimpleStoProcedureArgs;
  [ProcedureType.LaunchTieredSto]: LaunchTieredStoProcedureArgs;
  [ProcedureType.TogglePauseSto]: TogglePauseStoProcedureArgs;
  [ProcedureType.ControllerTransfer]: ControllerTransferProcedureArgs;
  [ProcedureType.SetController]: SetControllerProcedureArgs;
  [ProcedureType.AssignSecurityTokenRole]: AssignSecurityTokenRoleProcedureArgs;
  [ProcedureType.AssignStoRole]: AssignStoRoleProcedureArgs;
  [ProcedureType.ModifyTokenholderData]: ModifyTokenholderDataProcedureArgs;
  [ProcedureType.RevokeKyc]: RevokeKycProcedureArgs;
  [ProcedureType.IssueTokens]: IssueTokensProcedureArgs;
  [ProcedureType.ToggleAllowPreIssuing]: ToggleAllowPreIssuingProcedureArgs;
  [ProcedureType.DisableFeature]: DisableFeatureProcedureArgs;
  [ProcedureType.FinalizeSto]: FinalizeStoProcedureArgs;
  [ProcedureType.ToggleAllowBeneficialInvestments]: ToggleAllowBeneficialInvestmentsProcedureArgs;
  [ProcedureType.ModifyTieredStoData]: ModifyTieredStoDataProcedureArgs;
  [ProcedureType.InvestInTieredSto]: InvestInTieredStoProcedureArgs;
  [ProcedureType.InvestInSimpleSto]: InvestInSimpleStoProcedureArgs;
  [ProcedureType.EnableGeneralPermissionManager]: EnableGeneralPermissionManagerProcedureArgs;
  [ProcedureType.EnableGeneralTransferManager]: EnableGeneralTransferManagerProcedureArgs;
  [ProcedureType.ModifyMaxHolderCount]: ModifyMaxHolderCountProcedureArgs;
  [ProcedureType.ModifyMaxHolderPercentage]: ModifyMaxHolderPercentageProcedureArgs;
  [ProcedureType.ModifyPercentageExemptions]: ModifyPercentageExemptionsProcedureArgs;
  [ProcedureType.TransferSecurityTokens]: TransferSecurityTokensProcedureArgs;
  [ProcedureType.ToggleFreezeTransfers]: ToggleFreezeTransfersProcedureArgs;
  [ProcedureType.SignTransferData]: SignTransferDataProcedureArgs;
  [ProcedureType.SignDisableControllerAck]: SignDisableControllerAckProcedureArgs;
  [ProcedureType.SignFreezeIssuanceAck]: SignFreezeIssuanceAckProcedureArgs;
  [ProcedureType.TransferReservationOwnership]: TransferReservationOwnershipProcedureArgs;
  [ProcedureType.UnnamedProcedure]: {};
}

export enum TransactionStatus {
  Idle = 'Idle',
  Unapproved = 'Unapproved',
  Running = 'Running',
  Rejected = 'Rejected',
  Succeeded = 'Succeeded',
  Failed = 'Failed',
}

/**
 * @hidden
 */
export enum TransactionQueueStatus {
  Idle = 'Idle',
  Running = 'Running',
  Failed = 'Failed',
  Succeeded = 'Succeeded',
}

/**
 * Fees associated with running a [[TransactionQueue]]
 */
export interface Fees {
  /**
   * fees expressed in USD. Can be null if the Smart Contract doesn't specify one
   */
  usd: BigNumber | null;
  /**
   * fees expressed in POLY
   */
  poly: BigNumber;
}

export interface Pojo {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | Pojo
    | BigNumber
    | Date
    | (string | number | boolean | null | Pojo | BigNumber | Date)[];
}

/**
 * Check to see if an object is a Plain Old Javascript Object (POJO)
 */
export function isPojo(pojo: any): pojo is Pojo {
  if (!pojo) {
    return false;
  }

  const props = Object.getOwnPropertyNames(pojo);

  return (
    props.every(prop => {
      return typeof pojo[prop] !== 'function';
    }) && isPlainObject(pojo)
  );
}

export enum TransactionSpeed {
  Slow = 'Slow',
  Medium = 'Medium',
  Fast = 'Fast',
  Fastest = 'Fastest',
}

export enum Feature {
  Permissions = 'Permissions',
  Tokenholders = 'Tokenholders',
  Dividends = 'Dividends',
  TokenholderCountRestrictions = 'TokenholderCountRestrictions',
  PercentageOwnershipRestrictions = 'PercentageOwnershipRestrictions',
}

export enum SecurityTokenRole {
  PermissionsAdministrator = 'PermissionsAdministrator',
  DividendsOperator = 'DividendsOperator',
  DividendsAdministrator = 'DividendsAdministrator',
  TokenholdersAdministrator = 'TokenholdersAdministrator',
  TokenholderCountRestrictionsAdministrator = 'TokenholderCountRestrictionsAdministrator',
  PercentageOwnershipRestrictionsAdministrator = 'PercentageOwnershipRestrictionsAdministrator',
}

export enum StoRole {
  StoOperator = 'StoOperator',
  StoAdministrator = 'StoAdministrator',
}

export enum TransferStatusCode {
  TransferFailure = 'TransferFailure',
  TransferSuccess = 'TransferSuccess',
  InsufficientBalance = 'InsufficientBalance',
  InsufficientAllowance = 'InsufficientAllowance',
  TransfersHalted = 'TransfersHalted',
  FundsLocked = 'FundsLocked',
  InvalidSender = 'InvalidSender',
  InvalidReceiver = 'InvalidReceiver',
  InvalidOperator = 'InvalidOperator',
}

/*
 * Internal Types
 */

/**
 * Return the type that results from excluding a property from another type
 *
 * @param T - type to exclude from
 * @param K - name of the property that will be excluded
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Transaction method from the contract-wrappers package
 *
 * @param A - type of the arguments object that the method receives when being called
 */
export type LowLevelMethod<A> = (args: A) => Promise<PolyResponse>;

/**
 * Signature request method from the contract-wrappers package
 *
 * @param A - type of the arguments object that the method receives when being called
 */
export type SignatureRequest<A> = (args: A) => Promise<string>;

/**
 * Represents a contract method that doesn't exist yet but will exist
 * once a certain post transaction resolver is resolved
 *
 * @param T - type of the value that will be resolved by the post transaction resolver
 * @param U - type of the arguments object that the future method will accept
 */
export interface FutureLowLevelMethod<T, U> {
  /**
   * function that returns a low level method
   */
  futureMethod: (resolvedValue: T) => Promise<LowLevelMethod<U>>;
  /**
   * post transaction resolver that resolves into the value that is passed to the future method
   */
  futureValue: PostTransactionResolver<T>;
}

/**
 * Transforms a tuple of types into an array of resolver functions. For each type in the tuple, the corresponding resolver function returns that type wrapped in a promise
 */
export type ResolverArray<R extends any[]> = {
  [P in keyof R]: (receipt: TransactionReceiptWithDecodedLogs) => Promise<R[P]>
};

/**
 * Transforms a tuple of types into an array of Post Transaction Resolvers. For each type in the tuple, the corresponding Post Transaction Resolver resolves to that type
 *
 * @param Receipt - type of the receipt that the Post Transaction Resolver's resolver function will receive
 */
export type PostTransactionResolverArray<Value extends any[], Receipt extends any> = {
  [P in keyof Value]: PostTransactionResolver<Value[P], Receipt>
};

/**
 * Either a specific type or a Post Transaction Resolver that resolves to that type
 */
export type MaybeResolver<T> = PostTransactionResolver<T, any> | T;

/**
 * Apply the MaybeResolver type to a tuple of types
 */
export type MapMaybeResolver<T> = { [K in keyof T]: MaybeResolver<T[K]> };

/**
 * Schema of a specific transaction
 */
export interface TransactionSpec<
  Args = any,
  Value extends any[] = any[],
  Receipt extends any = any,
  FutureValue extends any = any
> {
  method: LowLevelMethod<Args> | SignatureRequest<Args> | FutureLowLevelMethod<FutureValue, Args>;
  args: MapMaybeResolver<Args>;
  postTransactionResolvers?: PostTransactionResolverArray<Value, Receipt>;
  tag?: PolyTransactionTag;
}

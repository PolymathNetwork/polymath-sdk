import { ModuleName, BigNumber } from '@polymathnetwork/contract-wrappers';
import { SubModule } from './SubModule';
import {
  EnableGeneralPermissionManager,
  EnableDividendManager,
  EnableGeneralTransferManager,
  DisableFeature,
  EnablePercentageTransferManager,
} from '../../procedures';
import {
  Feature,
  ErrorCode,
  EnableGeneralPermissionManagerProcedureArgs,
  EnableDividendManagerProcedureArgs,
  DisableFeatureProcedureArgs,
  EnableCountTransferManagerProcedureArgs,
  EnableGeneralTransferManagerProcedureArgs,
  EnablePercentageTransferManagerProcedureArgs,
  PercentageWhitelistEntry,
} from '../../types';
import { PolymathError } from '../../PolymathError';
import { TransactionQueue } from '../TransactionQueue';
import { EnableCountTransferManager } from '../../procedures/EnableCountTransferManager';

/**
 * Current status (enabled/disabled) of all Security Token Features
 */
export interface FeatureStatuses {
  [Feature.Permissions]: boolean;
  [Feature.Tokenholders]: boolean;
  [Feature.Dividends]: boolean;
  [Feature.TokenholderCountRestrictions]: boolean;
  [Feature.PercentageOwnershipRestrictions]: boolean;
}

type EnableOpts =
  | EnableErc20DividendsOpts
  | EnableTokenholderCountRestrictionsOpts
  | EnablePercentageOwnershipRestrictionsOpts;

export interface EnableErc20DividendsOpts {
  storageWalletAddress: string;
}

export interface EnableTokenholderCountRestrictionsOpts {
  maxHolderCount: number;
}

export interface EnablePercentageOwnershipRestrictionsOpts {
  maxHolderPercentage: BigNumber;
  allowPrimaryIssuance?: boolean;
  whitelistEntries?: PercentageWhitelistEntry[];
}

export interface Enable {
  (args: { feature: Feature.Permissions }): Promise<
    TransactionQueue<EnableGeneralPermissionManagerProcedureArgs>
  >;
  (args: { feature: Feature.Tokenholders }): Promise<
    TransactionQueue<EnableGeneralTransferManagerProcedureArgs>
  >;
  (args: { feature: Feature.Dividends }, opts: EnableErc20DividendsOpts): Promise<
    TransactionQueue<EnableDividendManagerProcedureArgs>
  >;
  (
    args: { feature: Feature.TokenholderCountRestrictions },
    opts: EnableTokenholderCountRestrictionsOpts
  ): Promise<TransactionQueue<EnableCountTransferManagerProcedureArgs>>;
  (
    args: { feature: Feature.PercentageOwnershipRestrictions },
    opts: EnablePercentageOwnershipRestrictionsOpts
  ): Promise<TransactionQueue<EnablePercentageTransferManagerProcedureArgs>>;
}

/**
 * Namespace that handles all Feature related functionality
 */
export class Features extends SubModule {
  /**
   * List of all existing features
   */
  public list: Feature[] = [
    Feature.Permissions,
    Feature.Tokenholders,
    Feature.Dividends,
    Feature.TokenholderCountRestrictions,
    Feature.PercentageOwnershipRestrictions,
  ];

  /**
   * Returns whether a particular feature has been enabled or not
   *
   * @param args.feature - feature for which to query status
   */
  public isEnabled = async (args: { feature: Feature }) => {
    const { feature } = args;
    const {
      context: { contractWrappers },
      securityToken: { symbol },
    } = this;
    const moduleName = this.getModuleNameFromFeature(feature);
    const attachedModule = (await contractWrappers.getAttachedModules(
      { symbol, moduleName },
      { unarchived: true }
    ))[0];

    return !!attachedModule;
  };

  /**
   * Gets the status on all Security Token features (true = enabled, false = not enabled/disabled)
   */
  public getStatus = async () => {
    const { list } = this;

    const [
      permissionsEnabled,
      tokenholdersEnabled,
      dividendsEnabled,
      countTransferManagerEnabled,
      percentageTransferManagerEnabled,
    ] = await Promise.all(list.map(feature => this.isEnabled({ feature })));

    const result: FeatureStatuses = {
      [Feature.Permissions]: permissionsEnabled,
      [Feature.Tokenholders]: tokenholdersEnabled,
      [Feature.Dividends]: dividendsEnabled,
      [Feature.TokenholderCountRestrictions]: countTransferManagerEnabled,
      [Feature.PercentageOwnershipRestrictions]: percentageTransferManagerEnabled,
    };

    return result;
  };

  /**
   * Enable a feature
   *
   * @param args.feature - feature to enable
   */
  public enable: Enable = async (
    args: { feature: Feature },
    opts?: EnableOpts
  ): Promise<TransactionQueue> => {
    const { feature } = args;

    const alreadyEnabled = await this.isEnabled({ feature });

    if (alreadyEnabled) {
      throw new PolymathError({
        code: ErrorCode.FatalError,
        message: `Feature '${feature}' already enabled`,
      });
    }

    const { symbol } = this.securityToken;
    let procedure;
    switch (feature) {
      case Feature.Permissions: {
        procedure = new EnableGeneralPermissionManager(
          {
            symbol,
            ...opts,
          },
          this.context
        );
        break;
      }
      case Feature.Tokenholders: {
        procedure = new EnableGeneralTransferManager(
          {
            symbol,
            ...opts,
          },
          this.context
        );
        break;
      }
      case Feature.Dividends: {
        procedure = new EnableDividendManager(
          { symbol, ...(opts as EnableErc20DividendsOpts) },
          this.context
        );
        break;
      }
      case Feature.TokenholderCountRestrictions: {
        procedure = new EnableCountTransferManager(
          { symbol, ...(opts as EnableTokenholderCountRestrictionsOpts) },
          this.context
        );
        break;
      }
      case Feature.PercentageOwnershipRestrictions: {
        procedure = new EnablePercentageTransferManager(
          { symbol, ...(opts as EnablePercentageOwnershipRestrictionsOpts) },
          this.context
        );
        break;
      }
      default: {
        throw new PolymathError({
          code: ErrorCode.FetcherValidationError,
          message: `Feature '${feature}' is not supported`,
        });
      }
    }

    return procedure.prepare();
  };

  /**
   * Disable a feature
   *
   * @param args.feature - feature to disable
   */
  public disable = async (args: {
    feature: Feature;
  }): Promise<TransactionQueue<DisableFeatureProcedureArgs>> => {
    const { feature } = args;

    const alreadyDisabled = !(await this.isEnabled({ feature }));

    if (alreadyDisabled) {
      throw new PolymathError({
        code: ErrorCode.FatalError,
        message: `Feature '${feature}' already disabled`,
      });
    }

    const { symbol } = this.securityToken;
    const moduleName = this.getModuleNameFromFeature(feature);
    const procedure = new DisableFeature(
      {
        symbol,
        moduleName,
      },
      this.context
    );

    return procedure.prepare();
  };

  private getModuleNameFromFeature = (feature: Feature): ModuleName => {
    let moduleName: ModuleName;
    switch (feature) {
      case Feature.Permissions:
        moduleName = ModuleName.GeneralPermissionManager;
        break;
      case Feature.Tokenholders:
        moduleName = ModuleName.GeneralTransferManager;
        break;
      case Feature.Dividends:
        moduleName = ModuleName.ERC20DividendCheckpoint;
        break;
      case Feature.TokenholderCountRestrictions:
        moduleName = ModuleName.CountTransferManager;
        break;
      case Feature.PercentageOwnershipRestrictions:
        moduleName = ModuleName.PercentageTransferManager;
        break;
      default:
        throw new PolymathError({
          code: ErrorCode.FetcherValidationError,
          message: `Feature '${feature}' is not supported`,
        });
    }

    return moduleName;
  };
}

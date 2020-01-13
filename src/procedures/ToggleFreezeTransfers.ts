import { Procedure } from './Procedure';
import {
  ToggleFreezeTransfersProcedureArgs,
  ErrorCode,
  ProcedureType,
  PolyTransactionTag,
} from '../types';
import { PolymathError } from '../PolymathError';
import { SecurityToken } from '../entities';
import { Factories } from '../Context';

/**
 * @hidden
 */
export const createToggleFreezeTransfersResolver = (
  factories: Factories,
  symbol: string
) => async () => {
  await factories.securityTokenFactory.refresh(SecurityToken.generateId({ symbol }));
};

/**
 * Procedure to toggle whether to freeze or unfreeze transfers for a security token
 */
export class ToggleFreezeTransfers extends Procedure<ToggleFreezeTransfersProcedureArgs> {
  public type = ProcedureType.ToggleFreezeTransfers;

  /**
   * - Freeze or unfreeze security token transfers
   *
   * - Refresh the SDK Security token factory
   *
   * Note this procedure will fail if the current wallet address is not the owner
   *
   * Note this procedure will fail if trying to freeze a security token that is already frozen
   *
   * Note this procedure will fail if trying to unfreeze a security token that is already unfrozen
   */
  public async prepareTransactions() {
    const { symbol, freeze } = this.args;
    const { contractWrappers, currentWallet, factories } = this.context;

    let securityToken;

    try {
      securityToken = await contractWrappers.tokenFactory.getSecurityTokenInstanceFromTicker(
        symbol
      );
    } catch (err) {
      throw new PolymathError({
        code: ErrorCode.ProcedureValidationError,
        message: `There is no Security Token with symbol ${symbol}`,
      });
    }

    const [owner, account, isFrozen] = await Promise.all([
      securityToken.owner(),
      currentWallet.address(),
      securityToken.transfersFrozen(),
    ]);

    if (account !== owner) {
      throw new PolymathError({
        code: ErrorCode.ProcedureValidationError,
        message: `You must be the owner of this Security Token to ${
          freeze ? 'freeze' : 'unfreeze'
        } the transfers`,
      });
    }

    if (isFrozen === freeze) {
      throw new PolymathError({
        code: ErrorCode.ProcedureValidationError,
        message: `Security Token Transfers are already ${freeze ? 'frozen' : 'unfrozen'}`,
      });
    }

    await this.addTransaction(
      freeze ? securityToken.freezeTransfers : securityToken.unfreezeTransfers,
      {
        tag: freeze ? PolyTransactionTag.FreezeTransfers : PolyTransactionTag.UnfreezeTransfers,
        resolvers: [createToggleFreezeTransfersResolver(factories, symbol)],
      }
    )({});
  }
}

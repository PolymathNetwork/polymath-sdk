import { Procedure } from './Procedure';
import {
  ProcedureTypes,
  PolyTransactionTags,
  EnableGeneralPermissionManagerProcedureArgs,
} from '../types';

export class EnableGeneralPermissionManager extends Procedure<
  EnableGeneralPermissionManagerProcedureArgs
> {
  public type = ProcedureTypes.EnableGeneralPermissionManager;

  public async prepareTransactions() {
    const { symbol } = this.args;
    const { securityTokenRegistry } = this.context;

    const securityToken = await securityTokenRegistry.getSecurityToken({
      ticker: symbol,
    });

    await this.addTransaction(securityToken.addGeneralPermissionManager, {
      tag: PolyTransactionTags.EnableGeneralPermissionManager,
    })();
  }
}

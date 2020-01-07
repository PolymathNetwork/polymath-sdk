import { Procedure } from './Procedure';
import {
  ProcedureType,
  PolyTransactionTag,
  FreezeIssuanceProcedureArgs,
  ErrorCode,
} from '../types';
import { PolymathError } from '../PolymathError';

export class FreezeIssuance extends Procedure<FreezeIssuanceProcedureArgs> {
  public type = ProcedureType.FreezeIssuance;

  public async prepareTransactions() {
    const { signature, symbol } = this.args;
    const { contractWrappers, currentWallet } = this.context;

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

    const [owner, account, isIssuable] = await Promise.all([
      securityToken.owner(),
      currentWallet.address(),
      securityToken.isIssuable(),
    ]);

    if (account !== owner) {
      throw new PolymathError({
        code: ErrorCode.ProcedureValidationError,
        message: `You must be the owner of this Security Token to freeze issuance`,
      });
    }

    if (!isIssuable) {
      throw new PolymathError({
        code: ErrorCode.ProcedureValidationError,
        message: `Issuance has already been frozen permanently`,
      });
    }
    // If there is no hex signature passed in, create a signature request to sign the freeze issuance acknowledgement
    const requestedSignature =
      signature || (await this.addSignatureRequest(securityToken.signFreezeIssuanceAck)({}));

    /*
     * Transactions
     */
    await this.addTransaction(securityToken.freezeIssuance, {
      tag: PolyTransactionTag.FreezeIssuance,
    })({ signature: requestedSignature });
  }
}

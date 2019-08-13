import { BigNumber } from '@polymathnetwork/contract-wrappers';
import { TransactionQueueStatus, isPojo } from '../../types';
import { MockedContract, getMockTransactionSpec } from '../../testUtils';
import { TransactionQueue } from '../TransactionQueue';

describe('TransactionQueue', () => {
  let testContract: MockedContract;

  beforeEach(() => {
    testContract = new MockedContract();
  });

  describe('constructor', () => {
    test('initializes properly', () => {
      const transaction = getMockTransactionSpec(testContract.fakeTxOne, []);
      const transactionQueue = new TransactionQueue([transaction], new BigNumber(0));
      expect(transactionQueue).toBeInstanceOf(TransactionQueue);
      expect(transactionQueue.run()).toBeInstanceOf(Promise);
    });
  });

  describe('#onTransactionStatusChange', () => {
    test("calls listener when any transaction's status is updated", async () => {
      const contract = new MockedContract({ autoResolve: false });

      const tx1 = getMockTransactionSpec(contract.fakeTxOne, []);
      const tx2 = getMockTransactionSpec(contract.fakeTxTwo, []);
      const transactionQueue = new TransactionQueue([tx1, tx2], new BigNumber(0));

      const polyTx1 = transactionQueue.transactions[0];
      const polyTx2 = transactionQueue.transactions[1];

      const spyListener = jest.fn();

      transactionQueue.onTransactionStatusChange(spyListener);
      transactionQueue.run();

      contract.fakeTxOnePolyResponse.resolve();
      await polyTx1.promise;
      const tx1Matcher = expect.objectContaining({ uid: polyTx1.uid });
      const tx2Matcher = expect.objectContaining({ uid: polyTx2.uid });
      const queueMatcher = expect.objectContaining({
        uid: transactionQueue.uid,
      });

      expect(spyListener).toHaveBeenLastCalledWith(tx1Matcher, queueMatcher);

      contract.fakeTxTwoPolyResponse.resolve();

      await polyTx2.promise;
      expect(spyListener).toHaveBeenLastCalledWith(tx2Matcher, queueMatcher);
    });
  });

  describe('#toPojo', () => {
    test('returns a plain object representing the entity', () => {
      const txOne = getMockTransactionSpec(testContract.fakeTxOne, ['stringOne']);

      const transactionQueue = new TransactionQueue([txOne], new BigNumber(0));

      expect(isPojo(transactionQueue.toPojo())).toBeTruthy();
    });
  });

  describe('#run', () => {
    test('runs the queue sequentially and resolves when done', async () => {
      const txOne = getMockTransactionSpec(testContract.fakeTxOne, ['stringOne']);
      const txTwo = getMockTransactionSpec(testContract.fakeTxTwo, ['stringTwo']);
      const transactionQueue = new TransactionQueue([txOne, txTwo], new BigNumber(0));
      const t1Promise = transactionQueue.transactions[0].promise;
      const t2Promise = transactionQueue.transactions[1].promise;

      transactionQueue.transactions[0].promise.then(() => {
        expect(txOne.method).toHaveBeenCalled();
        expect(txTwo.method).not.toHaveBeenCalled();
      });
      transactionQueue.transactions[1].promise.then(() => {
        expect(txTwo.method).toHaveBeenCalled();
      });

      await transactionQueue.run();

      await Promise.all([t1Promise, t2Promise]);
    });

    test("updates the queue's status correctly", async () => {
      const contract = new MockedContract({ autoResolve: false });
      const txOne = getMockTransactionSpec(contract.fakeTxOne, ['stringOne']);
      const txTwo = getMockTransactionSpec(contract.fakeTxTwo, ['stringTwo']);

      const transactionQueue = new TransactionQueue([txOne, txTwo], new BigNumber(0));

      expect(transactionQueue.status).toEqual(TransactionQueueStatus.Idle);
      const promise = transactionQueue.run();
      expect(transactionQueue.status).toEqual(TransactionQueueStatus.Running);
      contract.fakeTxOnePolyResponse.resolve();
      await transactionQueue.transactions[0].promise;
      expect(transactionQueue.status).toEqual(TransactionQueueStatus.Running);
      contract.fakeTxTwoPolyResponse.resolve();
      await transactionQueue.transactions[1].promise;

      expect(transactionQueue.status).toEqual(TransactionQueueStatus.Running);

      await promise;

      expect(transactionQueue.status).toEqual(TransactionQueueStatus.Succeeded);
    });
  });

  test('sets error and status as failed if any transaction fails', async () => {
    const contract = new MockedContract({ autoResolve: true });
    const failureTx = getMockTransactionSpec(contract.failureTx, []);
    const transactionQueue = new TransactionQueue([failureTx], new BigNumber(0));

    await expect(transactionQueue.run()).rejects.toEqual(expect.any(Error));

    expect(transactionQueue.status).toEqual(TransactionQueueStatus.Failed);
  });
});

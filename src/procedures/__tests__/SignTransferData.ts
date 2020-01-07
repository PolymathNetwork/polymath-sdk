import { ImportMock, MockManager } from 'ts-mock-imports';
import { spy, restore } from 'sinon';
import * as contractWrappersModule from '@polymathnetwork/contract-wrappers';
import * as contextModule from '../../Context';
import { Factories } from '../../Context';
import * as wrappersModule from '../../PolymathBase';
import * as tokenFactoryModule from '../../testUtils/MockedTokenFactoryModule';
import { SignTransferData } from '../../procedures/SignTransferData';
import { Procedure } from '../../procedures/Procedure';
import { ProcedureType, ErrorCode } from '../../types';
import { PolymathError } from '../../PolymathError';
import { mockFactories } from '../../testUtils/mockFactories';

const params = {
  symbol: 'TEST1',
  kycData: [
    {
      address: '0x01',
      canSendAfter: new Date(),
      canReceiveAfter: new Date(),
      kycExpiry: new Date(),
    },
    {
      address: '0x02',
      canSendAfter: new Date(),
      canReceiveAfter: new Date(),
      kycExpiry: new Date(),
    },
  ],
  validFrom: new Date(0),
  validTo: new Date(new Date().getTime() + 10000),
};

describe('SignTransferData', () => {
  let target: SignTransferData;
  let contextMock: MockManager<contextModule.Context>;
  let wrappersMock: MockManager<wrappersModule.PolymathBase>;
  let tokenFactoryMock: MockManager<tokenFactoryModule.MockedTokenFactoryModule>;
  let securityTokenMock: MockManager<contractWrappersModule.SecurityToken_3_0_0>;
  let factoriesMockedSetup: Factories;

  beforeEach(() => {
    // Mock the context, wrappers, tokenFactory and securityToken to test SignTransferData
    contextMock = ImportMock.mockClass(contextModule, 'Context');
    wrappersMock = ImportMock.mockClass(wrappersModule, 'PolymathBase');

    tokenFactoryMock = ImportMock.mockClass(tokenFactoryModule, 'MockedTokenFactoryModule');
    securityTokenMock = ImportMock.mockClass(contractWrappersModule, 'SecurityToken_3_0_0');

    tokenFactoryMock.mock(
      'getSecurityTokenInstanceFromTicker',
      securityTokenMock.getMockInstance()
    );

    contextMock.set('contractWrappers', wrappersMock.getMockInstance());
    wrappersMock.set('tokenFactory', tokenFactoryMock.getMockInstance());

    factoriesMockedSetup = mockFactories();
    contextMock.set('factories', factoriesMockedSetup);

    target = new SignTransferData(params, contextMock.getMockInstance());
  });

  afterEach(() => {
    restore();
  });

  describe('Types', () => {
    test('should extend procedure and have SignTransferData type', async () => {
      expect(target instanceof Procedure).toBe(true);
      expect(target.type).toBe(ProcedureType.SignTransferData);
    });
  });

  describe('SignTransferData', () => {
    test('should throw if there is no valid security token being provided', async () => {
      tokenFactoryMock
        .mock('getSecurityTokenInstanceFromTicker')
        .withArgs(params.symbol)
        .throws();

      await expect(target.prepareTransactions()).rejects.toThrow(
        new PolymathError({
          code: ErrorCode.ProcedureValidationError,
          message: `There is no Security Token with symbol ${params.symbol}`,
        })
      );
    });

    test('should throw if the signature validity lower bound is not an earlier date than the upper bound', async () => {
      const now = new Date();
      target = new SignTransferData(
        {
          ...params,
          validTo: now,
          validFrom: now,
        },
        contextMock.getMockInstance()
      );

      // Real call
      await expect(target.prepareTransactions()).rejects.toThrowError(
        new PolymathError({
          code: ErrorCode.ProcedureValidationError,
          message: 'Signature validity lower bound must be at an earlier date than the upper bound',
        })
      );
    });

    test('should throw if the signature validity upper bound is in the past', async () => {
      const now = new Date();
      target = new SignTransferData(
        {
          ...params,
          validTo: new Date(now.getTime() - 10000),
        },
        contextMock.getMockInstance()
      );

      // Real call
      await expect(target.prepareTransactions()).rejects.toThrowError(
        new PolymathError({
          code: ErrorCode.ProcedureValidationError,
          message: "Signature validity upper bound can't be in the past",
        })
      );
    });

    test('should add a signature request to the queue to sign whitelist data', async () => {
      const addSignatureRequestSpy = spy(target, 'addSignatureRequest');
      securityTokenMock.mock('signTransferData', Promise.resolve('SignTransferData'));

      // Real call
      await target.prepareTransactions();

      // Verifications
      expect(
        addSignatureRequestSpy
          .getCall(0)
          .calledWith(securityTokenMock.getMockInstance().signTransferData)
      ).toEqual(true);
      expect(addSignatureRequestSpy.callCount).toEqual(1);
    });
  });
});

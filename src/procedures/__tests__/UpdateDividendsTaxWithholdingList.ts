import { ImportMock, MockManager } from 'ts-mock-imports';
import { restore, spy } from 'sinon';
import * as contractWrappersModule from '@polymathnetwork/contract-wrappers';
import * as contextModule from '../../Context';
import { Factories } from '../../Context';
import * as wrappersModule from '../../PolymathBase';
import * as tokenFactoryModule from '../../testUtils/MockedTokenFactoryModule';
import * as taxWithholdingFactoryModule from '../../entities/factories/TaxWithholdingFactory';
import * as updateDividendsTaxWithholdingListModule from '../../procedures/UpdateDividendsTaxWithholdingList';
import { UpdateDividendsTaxWithholdingList } from '../../procedures';
import { Procedure } from '../../procedures/Procedure';
import {
  DividendType,
  ErrorCode,
  PolyTransactionTag,
  ProcedureType,
  UpdateDividendsTaxWithholdingListProcedureArgs,
} from '../../types';
import { PolymathError } from '../../PolymathError';
import { mockFactories } from '../../testUtils/mockFactories';

const testAddress = '0x6666666666666666666666666666666666666666';
const testAddress2 = '0x9999999999999999999999999999999999999999';

const params: UpdateDividendsTaxWithholdingListProcedureArgs = {
  symbol: 'Test1',
  dividendType: DividendType.Eth,
  shareholderAddresses: [testAddress, testAddress2],
  percentages: [10, 15],
};

describe('UpdateDividendsTaxWithholdingList', () => {
  let target: UpdateDividendsTaxWithholdingList;
  let contextMock: MockManager<contextModule.Context>;
  let wrappersMock: MockManager<wrappersModule.PolymathBase>;
  let tokenFactoryMock: MockManager<tokenFactoryModule.MockedTokenFactoryModule>;
  let securityTokenMock: MockManager<contractWrappersModule.SecurityToken_3_0_0>;
  let erc20DividendsMock: MockManager<contractWrappersModule.ERC20DividendCheckpoint_3_0_0>;
  let ethDividendsMock: MockManager<contractWrappersModule.EtherDividendCheckpoint_3_0_0>;
  let taxWithholdingFactoryMock: MockManager<taxWithholdingFactoryModule.TaxWithholdingFactory>;
  let factoriesMockedSetup: Factories;

  beforeEach(() => {
    // Mock the context, wrappers, tokenFactory and securityToken to test update dividends tax withholding list
    contextMock = ImportMock.mockClass(contextModule, 'Context');
    wrappersMock = ImportMock.mockClass(wrappersModule, 'PolymathBase');
    tokenFactoryMock = ImportMock.mockClass(tokenFactoryModule, 'MockedTokenFactoryModule');
    securityTokenMock = ImportMock.mockClass(contractWrappersModule, 'SecurityToken_3_0_0');
    erc20DividendsMock = ImportMock.mockClass(
      contractWrappersModule,
      'ERC20DividendCheckpoint_3_0_0'
    );
    ethDividendsMock = ImportMock.mockClass(
      contractWrappersModule,
      'EtherDividendCheckpoint_3_0_0'
    );
    tokenFactoryMock.mock(
      'getSecurityTokenInstanceFromTicker',
      securityTokenMock.getMockInstance()
    );
    contextMock.set('contractWrappers', wrappersMock.getMockInstance());
    wrappersMock.set('tokenFactory', tokenFactoryMock.getMockInstance());
    taxWithholdingFactoryMock = ImportMock.mockClass(
      taxWithholdingFactoryModule,
      'TaxWithholdingFactory'
    );
    factoriesMockedSetup = mockFactories();
    factoriesMockedSetup.taxWithholdingFactory = taxWithholdingFactoryMock.getMockInstance();
    contextMock.set('factories', factoriesMockedSetup);

    target = new UpdateDividendsTaxWithholdingList(params, contextMock.getMockInstance());
  });

  afterEach(() => {
    restore();
  });

  describe('Types', () => {
    test('should extend procedure and have UpdateDividendsTaxWithholdingList type', async () => {
      expect(target instanceof Procedure).toBe(true);
      expect(target.type).toBe(ProcedureType.UpdateDividendsTaxWithholdingList);
    });
  });

  describe('UpdateDividendsTaxWithholdingList', () => {
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

    test('should throw if there is no valid dividend type being provided', async () => {
      // Instantiate UpdateDividendsTaxWithholdingList with incorrect dividend type
      target = new UpdateDividendsTaxWithholdingList(
        { ...params, dividendType: 'wrong' as DividendType },
        contextMock.getMockInstance()
      );

      await expect(target.prepareTransactions()).rejects.toThrow(
        new PolymathError({
          code: ErrorCode.ProcedureValidationError,
          message: "Dividends of the specified type haven't been enabled",
        })
      );
    });

    test('should throw if an Erc20 dividend module is not attached', async () => {
      // Instantiate UpdateDividendsTaxWithholdingList with ERC20 dividend type
      target = new UpdateDividendsTaxWithholdingList(
        { ...params, dividendType: DividendType.Erc20 },
        contextMock.getMockInstance()
      );

      wrappersMock.mock('getAttachedModules', Promise.resolve([]));

      // Real call
      await expect(target.prepareTransactions()).rejects.toThrowError(
        new PolymathError({
          code: ErrorCode.ProcedureValidationError,
          message: "Dividends of the specified type haven't been enabled",
        })
      );
    });

    test('should throw if an Eth dividend module is not attached', async () => {
      // Instantiate UpdateDividendsTaxWithholdingList with ETH dividend type
      target = new UpdateDividendsTaxWithholdingList(
        { ...params, dividendType: DividendType.Eth },
        contextMock.getMockInstance()
      );

      wrappersMock.mock('getAttachedModules', Promise.resolve([]));

      // Real call
      await expect(target.prepareTransactions()).rejects.toThrowError(
        new PolymathError({
          code: ErrorCode.ProcedureValidationError,
          message: "Dividends of the specified type haven't been enabled",
        })
      );
    });

    test('should add a transaction to push a dividend payment for an attached ERC20 dividends module', async () => {
      // Instantiate UpdateDividendsTaxWithholdingList with ERC20 dividend type
      target = new UpdateDividendsTaxWithholdingList(
        { ...params, dividendType: DividendType.Erc20 },
        contextMock.getMockInstance()
      );

      wrappersMock.mock(
        'getAttachedModules',
        Promise.resolve([erc20DividendsMock.getMockInstance()])
      );

      erc20DividendsMock.mock('setWithholding', Promise.resolve('SetWithholding'));

      const addTransactionSpy = spy(target, 'addTransaction');

      // Real call
      await target.prepareTransactions();

      // Verifications
      expect(
        addTransactionSpy.getCall(0).calledWith(erc20DividendsMock.getMockInstance().setWithholding)
      ).toEqual(true);
      expect(addTransactionSpy.getCall(0).lastArg.tag).toEqual(
        PolyTransactionTag.SetErc20TaxWithholding
      );
      expect(addTransactionSpy.callCount).toEqual(1);
    });

    test('should add a transaction to push a dividend payment of an attached ETH dividends module', async () => {
      // Instantiate UpdateDividendsTaxWithholdingList with ETH dividend type
      target = new UpdateDividendsTaxWithholdingList(
        { ...params, dividendType: DividendType.Eth },
        contextMock.getMockInstance()
      );

      wrappersMock.mock(
        'getAttachedModules',
        Promise.resolve([ethDividendsMock.getMockInstance()])
      );

      ethDividendsMock.mock('setWithholding', Promise.resolve('SetWithholding'));

      const addTransactionSpy = spy(target, 'addTransaction');

      // Real call
      await target.prepareTransactions();

      // Verifications
      expect(
        addTransactionSpy.getCall(0).calledWith(ethDividendsMock.getMockInstance().setWithholding)
      ).toEqual(true);
      expect(addTransactionSpy.getCall(0).lastArg.tag).toEqual(
        PolyTransactionTag.SetEtherTaxWithholding
      );
      expect(addTransactionSpy.callCount).toEqual(1);
    });

    /*
    test('should update the dividends tax withholding list for erc20 token', async () => {
      const updateStub = taxWithholdingFactoryMock.mock(
        'update',
        Promise.resolve()
      );

      const resolverValue = await updateDividendsTaxWithholdingListModule.updateDividendsTaxWithholdingListResolver(
        factoriesMockedSetup,
        params.symbol,
        DividendType.Erc20,
        [10,20],
        [testAddress, testAddress2],
    );
      // expect(
      //   updateStub.getCall(0).calledWithExactly(
      //     TaxWithholding.generateId({
      //       securityTokenId: SecurityToken.generateId({
      //         symbol: params.symbol,
      //       }),
      //       dividendType: DividendType.Erc20,
      //         shareholderAddress: testAddress,
      //     })
      //   )
      // ).toEqual(true);
      // expect(resolverValue).toEqual(Promise.resolve());
      // expect(updateStub.callCount).toEqual(1);
    });
    */
  });
});

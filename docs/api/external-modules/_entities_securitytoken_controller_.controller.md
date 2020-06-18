# Controller

Namespace that handles all Controller related functionality

## Hierarchy

* [SubModule]()

  ↳ **Controller**

## Index

### Constructors

* [constructor]()

### Properties

* [context]()
* [securityToken]()

### Methods

* [disable]()
* [modifyController]()
* [redeem]()
* [signDisableAck]()
* [transfer]()

## Constructors

### constructor

+ **new Controller**\(`securityToken`: [SecurityToken](), `context`: [Context]()\): [_Controller_]()

_Inherited from_ [_SubModule_]()_._[_constructor_]()

_Defined in_ [_src/entities/SecurityToken/SubModule.ts:10_](https://github.com/PolymathNetwork/polymath-sdk/blob/550676f/src/entities/SecurityToken/SubModule.ts#L10)

Create a new SubModule instance

**Parameters:**

| Name | Type |
| :--- | :--- |
| `securityToken` | [SecurityToken]() |
| `context` | [Context]() |

**Returns:** [_Controller_]()

## Properties

### `Protected` context

• **context**: [_Context_]()

_Inherited from_ [_SubModule_]()_._[_context_]()

_Defined in_ [_src/entities/SecurityToken/SubModule.ts:10_](https://github.com/PolymathNetwork/polymath-sdk/blob/550676f/src/entities/SecurityToken/SubModule.ts#L10)

### `Protected` securityToken

• **securityToken**: [_SecurityToken_]()

_Inherited from_ [_SubModule_]()_._[_securityToken_]()

_Defined in_ [_src/entities/SecurityToken/SubModule.ts:8_](https://github.com/PolymathNetwork/polymath-sdk/blob/550676f/src/entities/SecurityToken/SubModule.ts#L8)

## Methods

### disable

▸ **disable**\(`args?`: undefined \| object\): _Promise‹_[_TransactionQueue_]()_‹_[_DisableControllerProcedureArgs_]()_, void››_

_Defined in_ [_src/entities/SecurityToken/Controller.ts:33_](https://github.com/PolymathNetwork/polymath-sdk/blob/550676f/src/entities/SecurityToken/Controller.ts#L33)

Permanently disable controller functionality

**Parameters:**

| Name | Type |
| :--- | :--- |
| `args?` | undefined \| object |

**Returns:** _Promise‹_[_TransactionQueue_]()_‹_[_DisableControllerProcedureArgs_]()_, void››_

### modifyController

▸ **modifyController**\(`args`: object\): _Promise‹_[_TransactionQueue_]()_‹_[_SetControllerProcedureArgs_]()_, void››_

_Defined in_ [_src/entities/SecurityToken/Controller.ts:20_](https://github.com/PolymathNetwork/polymath-sdk/blob/550676f/src/entities/SecurityToken/Controller.ts#L20)

Set the address of the Security Token's Controller. The controller may perform forced transfers

**Parameters:**

▪ **args**: _object_

| Name | Type |
| :--- | :--- |
| `controller` | string |

**Returns:** _Promise‹_[_TransactionQueue_]()_‹_[_SetControllerProcedureArgs_]()_, void››_

### redeem

▸ **redeem**\(`args`: object\): _Promise‹_[_TransactionQueue_]()_‹_[_ControllerRedeemProcedureArgs_]()_, void››_

_Defined in_ [_src/entities/SecurityToken/Controller.ts:77_](https://github.com/PolymathNetwork/polymath-sdk/blob/550676f/src/entities/SecurityToken/Controller.ts#L77)

Redeem \(burn\) an amount of tokens from a token holder. Only the Security Token's controller can call this This operation is subject to transfer restrictions and the amount is limited by the token holder's balance. `balanceOf(tokenHolder)` tokens\) and potentially also need to respect other transfer restrictions.

**Parameters:**

▪ **args**: _object_

| Name | Type |
| :--- | :--- |
| `amount` | BigNumber |
| `data?` | undefined \| string |
| `from` | string |
| `reason?` | undefined \| string |

**Returns:** _Promise‹_[_TransactionQueue_]()_‹_[_ControllerRedeemProcedureArgs_]()_, void››_

### signDisableAck

▸ **signDisableAck**\(\): _Promise‹_[_TransactionQueue_]()_‹_[_SignDisableControllerAckProcedureArgs_]()_, void››_

_Defined in_ [_src/entities/SecurityToken/Controller.ts:95_](https://github.com/PolymathNetwork/polymath-sdk/blob/550676f/src/entities/SecurityToken/Controller.ts#L95)

Generate a signature string that can be used to permanently disable the Security Token's controller functionality

**Note that only the owner's signature is valid for this operation**

**Returns:** _Promise‹_[_TransactionQueue_]()_‹_[_SignDisableControllerAckProcedureArgs_]()_, void››_

### transfer

▸ **transfer**\(`args`: object\): _Promise‹_[_TransactionQueue_]()_‹_[_ControllerTransferProcedureArgs_]()_, void››_

_Defined in_ [_src/entities/SecurityToken/Controller.ts:49_](https://github.com/PolymathNetwork/polymath-sdk/blob/550676f/src/entities/SecurityToken/Controller.ts#L49)

Perform a forced transfer of tokens from one address to another. You must be the Security Token's controller to do this

**Parameters:**

▪ **args**: _object_

| Name | Type |
| :--- | :--- |
| `amount` | BigNumber |
| `data?` | undefined \| string |
| `from` | string |
| `reason?` | undefined \| string |
| `to` | string |

**Returns:** _Promise‹_[_TransactionQueue_]()_‹_[_ControllerTransferProcedureArgs_]()_, void››_

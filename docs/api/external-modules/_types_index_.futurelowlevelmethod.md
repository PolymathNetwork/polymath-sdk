# FutureLowLevelMethod

Represents a contract method that doesn't exist yet but will exist once a certain post transaction resolver is resolved

## Type parameters

▪ **T**

type of the value that will be resolved by the post transaction resolver

▪ **U**

type of the arguments object that the future method will accept

## Hierarchy

* **FutureLowLevelMethod**

## Index

### Properties

* [futureMethod]()
* [futureValue]()

## Properties

### futureMethod

• **futureMethod**: _function_

_Defined in_ [_src/types/index.ts:1519_](https://github.com/PolymathNetwork/polymath-sdk/blob/550676f/src/types/index.ts#L1519)

function that returns a low level method

#### Type declaration:

▸ \(`resolvedValue`: T\): _Promise‹_[_LowLevelMethod_](_types_index_.md#lowlevelmethod)_‹U››_

**Parameters:**

| Name | Type |
| :--- | :--- |
| `resolvedValue` | T |

### futureValue

• **futureValue**: _PostTransactionResolver‹T›_

_Defined in_ [_src/types/index.ts:1523_](https://github.com/PolymathNetwork/polymath-sdk/blob/550676f/src/types/index.ts#L1523)

post transaction resolver that resolves into the value that is passed to the future method

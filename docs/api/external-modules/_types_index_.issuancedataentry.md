# IssuanceDataEntry

Specifies how many tokens to issue and who to issue them to

## Hierarchy

* **IssuanceDataEntry**

## Index

### Properties

* [address]()
* [amount]()
* [tokenholderData]()

## Properties

### address

• **address**: _string_

_Defined in_ [_src/types/index.ts:83_](https://github.com/PolymathNetwork/polymath-sdk/blob/550676f/src/types/index.ts#L83)

wallet address where Tokens will be received

### amount

• **amount**: _BigNumber_

_Defined in_ [_src/types/index.ts:87_](https://github.com/PolymathNetwork/polymath-sdk/blob/550676f/src/types/index.ts#L87)

amount of tokens to be issued

### `Optional` tokenholderData

• **tokenholderData**? : [_Omit_](_types_index_.md#omit)_‹_[_TokenholderDataEntry_]()_, "address"›_

_Defined in_ [_src/types/index.ts:91_](https://github.com/PolymathNetwork/polymath-sdk/blob/550676f/src/types/index.ts#L91)

KYC data for the Tokenholder

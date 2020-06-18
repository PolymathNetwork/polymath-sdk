# EntityClass

Represents an entity

## Type parameters

▪ **T**

▪ **U**

## Hierarchy

* **EntityClass**

## Index

### Constructors

* [constructor]()

### Methods

* [generateId]()
* [unserialize]()

## Constructors

### constructor

+ **new EntityClass**\(`params`: T & U, `context`: [Context]()\): [_Entity_]()_‹T›_

_Defined in_ [_src/entities/factories/Factory.ts:8_](https://github.com/PolymathNetwork/polymath-sdk/blob/550676f/src/entities/factories/Factory.ts#L8)

**Parameters:**

| Name | Type |
| :--- | :--- |
| `params` | T & U |
| `context` | [Context]() |

**Returns:** [_Entity_]()_‹T›_

## Methods

### generateId

▸ **generateId**\(`identifiers`: U\): _string_

_Defined in_ [_src/entities/factories/Factory.ts:19_](https://github.com/PolymathNetwork/polymath-sdk/blob/550676f/src/entities/factories/Factory.ts#L19)

generate a unique identifier for an entity

**Parameters:**

| Name | Type |
| :--- | :--- |
| `identifiers` | U |

**Returns:** _string_

### unserialize

▸ **unserialize**\(`uid`: string\): _U_

_Defined in_ [_src/entities/factories/Factory.ts:14_](https://github.com/PolymathNetwork/polymath-sdk/blob/550676f/src/entities/factories/Factory.ts#L14)

unserialize serialized entity information

**Parameters:**

| Name | Type |
| :--- | :--- |
| `uid` | string |

**Returns:** _U_

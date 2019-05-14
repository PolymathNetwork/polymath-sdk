// eslint:disable
export const SecurityTokenAbi = {
  contractName: 'SecurityToken',
  abi: [
    {
      constant: true,
      inputs: [],
      name: 'name',
      outputs: [
        {
          name: '',
          type: 'string',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_spender',
          type: 'address',
        },
        {
          name: '_value',
          type: 'uint256',
        },
      ],
      name: 'approve',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'totalSupply',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [
        {
          name: '',
          type: 'uint8',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'currentCheckpointId',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'granularity',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_spender',
          type: 'address',
        },
        {
          name: '_subtractedValue',
          type: 'uint256',
        },
      ],
      name: 'decreaseApproval',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'polyToken',
      outputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_owner',
          type: 'address',
        },
      ],
      name: 'balanceOf',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'renounceOwnership',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'polymathRegistry',
      outputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'controllerDisabled',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'owner',
      outputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'symbol',
      outputs: [
        {
          name: '',
          type: 'string',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'mintingFrozen',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'moduleRegistry',
      outputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'featureRegistry',
      outputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'securityTokenRegistry',
      outputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'tokenDetails',
      outputs: [
        {
          name: '',
          type: 'string',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_spender',
          type: 'address',
        },
        {
          name: '_addedValue',
          type: 'uint256',
        },
      ],
      name: 'increaseApproval',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_owner',
          type: 'address',
        },
        {
          name: '_spender',
          type: 'address',
        },
      ],
      name: 'allowance',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'transfersFrozen',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_newOwner',
          type: 'address',
        },
      ],
      name: 'transferOwnership',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'updateFromRegistry',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'controller',
      outputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          name: '_name',
          type: 'string',
        },
        {
          name: '_symbol',
          type: 'string',
        },
        {
          name: '_decimals',
          type: 'uint8',
        },
        {
          name: '_granularity',
          type: 'uint256',
        },
        {
          name: '_tokenDetails',
          type: 'string',
        },
        {
          name: '_polymathRegistry',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_types',
          type: 'uint8[]',
        },
        {
          indexed: false,
          name: '_name',
          type: 'bytes32',
        },
        {
          indexed: false,
          name: '_moduleFactory',
          type: 'address',
        },
        {
          indexed: false,
          name: '_module',
          type: 'address',
        },
        {
          indexed: false,
          name: '_moduleCost',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_budget',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_timestamp',
          type: 'uint256',
        },
      ],
      name: 'ModuleAdded',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_oldDetails',
          type: 'string',
        },
        {
          indexed: false,
          name: '_newDetails',
          type: 'string',
        },
      ],
      name: 'UpdateTokenDetails',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_oldGranularity',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_newGranularity',
          type: 'uint256',
        },
      ],
      name: 'GranularityChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_types',
          type: 'uint8[]',
        },
        {
          indexed: false,
          name: '_module',
          type: 'address',
        },
        {
          indexed: false,
          name: '_timestamp',
          type: 'uint256',
        },
      ],
      name: 'ModuleArchived',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_types',
          type: 'uint8[]',
        },
        {
          indexed: false,
          name: '_module',
          type: 'address',
        },
        {
          indexed: false,
          name: '_timestamp',
          type: 'uint256',
        },
      ],
      name: 'ModuleUnarchived',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_types',
          type: 'uint8[]',
        },
        {
          indexed: false,
          name: '_module',
          type: 'address',
        },
        {
          indexed: false,
          name: '_timestamp',
          type: 'uint256',
        },
      ],
      name: 'ModuleRemoved',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_moduleTypes',
          type: 'uint8[]',
        },
        {
          indexed: false,
          name: '_module',
          type: 'address',
        },
        {
          indexed: false,
          name: '_oldBudget',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_budget',
          type: 'uint256',
        },
      ],
      name: 'ModuleBudgetChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_status',
          type: 'bool',
        },
        {
          indexed: false,
          name: '_timestamp',
          type: 'uint256',
        },
      ],
      name: 'FreezeTransfers',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: '_checkpointId',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_timestamp',
          type: 'uint256',
        },
      ],
      name: 'CheckpointCreated',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_timestamp',
          type: 'uint256',
        },
      ],
      name: 'FreezeMinting',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: '_to',
          type: 'address',
        },
        {
          indexed: false,
          name: '_value',
          type: 'uint256',
        },
      ],
      name: 'Minted',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: '_from',
          type: 'address',
        },
        {
          indexed: false,
          name: '_value',
          type: 'uint256',
        },
      ],
      name: 'Burnt',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: '_oldController',
          type: 'address',
        },
        {
          indexed: true,
          name: '_newController',
          type: 'address',
        },
      ],
      name: 'SetController',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: '_controller',
          type: 'address',
        },
        {
          indexed: true,
          name: '_from',
          type: 'address',
        },
        {
          indexed: true,
          name: '_to',
          type: 'address',
        },
        {
          indexed: false,
          name: '_value',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_verifyTransfer',
          type: 'bool',
        },
        {
          indexed: false,
          name: '_data',
          type: 'bytes',
        },
      ],
      name: 'ForceTransfer',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: '_controller',
          type: 'address',
        },
        {
          indexed: true,
          name: '_from',
          type: 'address',
        },
        {
          indexed: false,
          name: '_value',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_verifyTransfer',
          type: 'bool',
        },
        {
          indexed: false,
          name: '_data',
          type: 'bytes',
        },
      ],
      name: 'ForceBurn',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_timestamp',
          type: 'uint256',
        },
      ],
      name: 'DisableController',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'previousOwner',
          type: 'address',
        },
      ],
      name: 'OwnershipRenounced',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'previousOwner',
          type: 'address',
        },
        {
          indexed: true,
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'OwnershipTransferred',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'owner',
          type: 'address',
        },
        {
          indexed: true,
          name: 'spender',
          type: 'address',
        },
        {
          indexed: false,
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Approval',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'from',
          type: 'address',
        },
        {
          indexed: true,
          name: 'to',
          type: 'address',
        },
        {
          indexed: false,
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Transfer',
      type: 'event',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_moduleFactory',
          type: 'address',
        },
        {
          name: '_data',
          type: 'bytes',
        },
        {
          name: '_maxCost',
          type: 'uint256',
        },
        {
          name: '_budget',
          type: 'uint256',
        },
      ],
      name: 'addModule',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_module',
          type: 'address',
        },
      ],
      name: 'archiveModule',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_module',
          type: 'address',
        },
      ],
      name: 'unarchiveModule',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_module',
          type: 'address',
        },
      ],
      name: 'removeModule',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_module',
          type: 'address',
        },
      ],
      name: 'getModule',
      outputs: [
        {
          name: '',
          type: 'bytes32',
        },
        {
          name: '',
          type: 'address',
        },
        {
          name: '',
          type: 'address',
        },
        {
          name: '',
          type: 'bool',
        },
        {
          name: '',
          type: 'uint8[]',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_name',
          type: 'bytes32',
        },
      ],
      name: 'getModulesByName',
      outputs: [
        {
          name: '',
          type: 'address[]',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_type',
          type: 'uint8',
        },
      ],
      name: 'getModulesByType',
      outputs: [
        {
          name: '',
          type: 'address[]',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_tokenContract',
          type: 'address',
        },
        {
          name: '_value',
          type: 'uint256',
        },
      ],
      name: 'withdrawERC20',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_module',
          type: 'address',
        },
        {
          name: '_change',
          type: 'uint256',
        },
        {
          name: '_increase',
          type: 'bool',
        },
      ],
      name: 'changeModuleBudget',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_newTokenDetails',
          type: 'string',
        },
      ],
      name: 'updateTokenDetails',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_granularity',
          type: 'uint256',
        },
      ],
      name: 'changeGranularity',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'getInvestors',
      outputs: [
        {
          name: '',
          type: 'address[]',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_checkpointId',
          type: 'uint256',
        },
      ],
      name: 'getInvestorsAt',
      outputs: [
        {
          name: '',
          type: 'address[]',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_start',
          type: 'uint256',
        },
        {
          name: '_end',
          type: 'uint256',
        },
      ],
      name: 'iterateInvestors',
      outputs: [
        {
          name: '',
          type: 'address[]',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'getInvestorCount',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'freezeTransfers',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'unfreezeTransfers',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_to',
          type: 'address',
        },
        {
          name: '_value',
          type: 'uint256',
        },
      ],
      name: 'transfer',
      outputs: [
        {
          name: 'success',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_to',
          type: 'address',
        },
        {
          name: '_value',
          type: 'uint256',
        },
        {
          name: '_data',
          type: 'bytes',
        },
      ],
      name: 'transferWithData',
      outputs: [
        {
          name: 'success',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_from',
          type: 'address',
        },
        {
          name: '_to',
          type: 'address',
        },
        {
          name: '_value',
          type: 'uint256',
        },
      ],
      name: 'transferFrom',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_from',
          type: 'address',
        },
        {
          name: '_to',
          type: 'address',
        },
        {
          name: '_value',
          type: 'uint256',
        },
        {
          name: '_data',
          type: 'bytes',
        },
      ],
      name: 'transferFromWithData',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_from',
          type: 'address',
        },
        {
          name: '_to',
          type: 'address',
        },
        {
          name: '_value',
          type: 'uint256',
        },
        {
          name: '_data',
          type: 'bytes',
        },
      ],
      name: 'verifyTransfer',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'freezeMinting',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_investor',
          type: 'address',
        },
        {
          name: '_value',
          type: 'uint256',
        },
      ],
      name: 'mint',
      outputs: [
        {
          name: 'success',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_investor',
          type: 'address',
        },
        {
          name: '_value',
          type: 'uint256',
        },
        {
          name: '_data',
          type: 'bytes',
        },
      ],
      name: 'mintWithData',
      outputs: [
        {
          name: 'success',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_investors',
          type: 'address[]',
        },
        {
          name: '_values',
          type: 'uint256[]',
        },
      ],
      name: 'mintMulti',
      outputs: [
        {
          name: 'success',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_delegate',
          type: 'address',
        },
        {
          name: '_module',
          type: 'address',
        },
        {
          name: '_perm',
          type: 'bytes32',
        },
      ],
      name: 'checkPermission',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_value',
          type: 'uint256',
        },
        {
          name: '_data',
          type: 'bytes',
        },
      ],
      name: 'burnWithData',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_from',
          type: 'address',
        },
        {
          name: '_value',
          type: 'uint256',
        },
        {
          name: '_data',
          type: 'bytes',
        },
      ],
      name: 'burnFromWithData',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'createCheckpoint',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'getCheckpointTimes',
      outputs: [
        {
          name: '',
          type: 'uint256[]',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_checkpointId',
          type: 'uint256',
        },
      ],
      name: 'totalSupplyAt',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_investor',
          type: 'address',
        },
        {
          name: '_checkpointId',
          type: 'uint256',
        },
      ],
      name: 'balanceOfAt',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_controller',
          type: 'address',
        },
      ],
      name: 'setController',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'disableController',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_from',
          type: 'address',
        },
        {
          name: '_to',
          type: 'address',
        },
        {
          name: '_value',
          type: 'uint256',
        },
        {
          name: '_data',
          type: 'bytes',
        },
        {
          name: '_log',
          type: 'bytes',
        },
      ],
      name: 'forceTransfer',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_from',
          type: 'address',
        },
        {
          name: '_value',
          type: 'uint256',
        },
        {
          name: '_data',
          type: 'bytes',
        },
        {
          name: '_log',
          type: 'bytes',
        },
      ],
      name: 'forceBurn',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'getVersion',
      outputs: [
        {
          name: '',
          type: 'uint8[]',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
  ],
};

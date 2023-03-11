const factoryABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "int256[]",
        "name": "_coefficients",
        "type": "int256[]"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "_intercept",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "_accuracy",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "string[]",
        "name": "_attributes",
        "type": "string[]"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "_collection",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_denomination",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_manipulation",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "_opensource",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "index",
        "type": "address"
      }
    ],
    "name": "IndexCreated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "_parameters",
    "outputs": [
      {
        "internalType": "address",
        "name": "_exchange",
        "type": "address"
      },
      {
        "internalType": "int256",
        "name": "_intercept",
        "type": "int256"
      },
      {
        "internalType": "uint8",
        "name": "_accuracy",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "_collection",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_denomination",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_uma",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_manipulation",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_opensource",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "int256[]",
        "name": "_coefficients",
        "type": "int256[]"
      },
      {
        "internalType": "int256",
        "name": "_intercept",
        "type": "int256"
      },
      {
        "internalType": "uint8",
        "name": "_accuracy",
        "type": "uint8"
      },
      {
        "internalType": "string[]",
        "name": "_attributes",
        "type": "string[]"
      },
      {
        "internalType": "address",
        "name": "_collection",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_denomination",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_manipulation",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_opensource",
        "type": "bool"
      }
    ],
    "name": "createIndex",
    "outputs": [
      {
        "internalType": "address",
        "name": "index",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "exchange",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "getIndex",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getIndices",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getParameters",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "int256[]",
        "name": "",
        "type": "int256[]"
      },
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      },
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      },
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "indices",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "isIndex",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "index",
        "type": "address"
      }
    ],
    "name": "isValid",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "uma",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "valid_denomination",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
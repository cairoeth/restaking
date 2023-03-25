export function stringToColour(text: string) {
  var hash = 0;
  for (var i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

export function hexToRgbA(hex: string) {
  var c: any;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',1)';
  }
  throw new Error('Bad Hex');
}

export const contracts = {
  controller: {
    address: {
      Restaking: '0x25A1DF485cFBb93117f12fc673D87D1cddEb845a',
      Goerli: '',
      Optimism: '',
      Gnosis: '',
      'Scroll Testnet': '',
      'Polygon zkEVM Testnet': ''
    },
    abi: [
      {
        name: 'createWrapper',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [{ internalType: 'address', name: 'token', type: 'address' }],
        outputs: [],
      },
      {
        name: 'allWrappers',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ internalType: "address[]", name: "", type: "address[]" }
        ],
      },
      {
        name: 'addModule',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [{ internalType: 'address', name: 'module', type: 'address' }],
        outputs: [],
      },
      {
        name: 'allModules',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ internalType: "address[]", name: "", type: "address[]" }
        ],
      },
      {
        inputs: [{indexed: true, internalType: "address", name: "module", type: "address"}],
        name: "ModuleAdded",
        type: "event"
      }
    ]
  },
  wrapper: {
    abi: [
      {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "wrapped",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [{ internalType: "address", name: "", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function"
      },
      {
        name: 'decimals',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }
        ],
      },
    ]
  },
  module: {
    abi: [
      {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "image",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "getTokens",
        outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
        stateMutability: "view",
        type: "function"
      },
    ]
  }
}

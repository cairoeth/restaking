import { erc20ABI } from 'wagmi'

function stringToColour(text: string) {
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

function hexToRgbA(hex: string) {
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
    address: '0xA3f7BF5b0fa93176c260BBa57ceE85525De2BaF4',
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
    ]
  },
  wrapper: {
    abi: [
      {
        inputs: [],
        name: "name",
        outputs: [{internalType: "string", name: "", type: "string"}],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [{internalType: "string", name: "", type: "string"}],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "wrapped",
        outputs: [{internalType: "address", name: "", type: "address"}],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [{internalType: "uint256", name: "", type: "uint256"}],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [{internalType: "address", name: "", type: "address"}],
        name: "balanceOf",
        outputs: [{internalType: "uint256", name: "", type: "uint256"}],
        stateMutability: "view",
        type: "function"
      },
    ]
  }
}

export const tokens = [
  {
    // WETH
    symbol: 'WETH',
    address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    abi: erc20ABI,
    image: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
    // image: 'https://etherscan.io/images/main/empty-token.png',
    price: 1667,
    color: hexToRgbA(stringToColour('0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'))
  },
  {
    // USDC
    symbol: 'USDC',
    address: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
    abi: erc20ABI,
    image: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    price: 1,
    color: hexToRgbA(stringToColour('0x07865c6E87B9F70255377e024ace6630C1Eaa37F'))
  },
  {
    // DAI
    symbol: 'DAI',
    address: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844',
    abi: erc20ABI,
    image: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
    price: 1,
    color: hexToRgbA(stringToColour('0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844'))
  },
  {
    // USDT
    symbol: 'USDT',
    address: '0xb0f7554a44cC178e935Ea10c79e7c042D1840044',
    abi: erc20ABI,
    image: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
    price: 1,
    color: hexToRgbA(stringToColour('0xb0f7554a44cC178e935Ea10c79e7c042D1840044'))
  },
]

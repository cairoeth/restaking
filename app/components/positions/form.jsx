import * as React from 'react'
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import {
  utils,
} from 'ethers'

function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  React.useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}

export function Put({ index, setCallActive }) {
  const [strike, setStrike] = React.useState(1);
  const [expirationDays, setExpirationDays] = React.useState(30);
  const [leverage, setLeveraege] = React.useState(10);

  const debouncedStrike = useDebounce(strike, 500);
  const debouncedExpiration = useDebounce(expirationDays, 500);
  const debouncedLeverage = useDebounce(leverage, 500);

  const { config } = usePrepareContractWrite({
    address: '0xcbB45f7A705238dC7BbC1eae5fD238FF2507cE9B',
    abi: [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_index",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "_type",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "_strike",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_expiry",
            "type": "uint256"
          }
        ],
        "name": "requestOption",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "_index",
                "type": "address"
              },
              {
                "internalType": "bool",
                "name": "_type",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "_strike",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "_premium",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "_expiry",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "_denomination",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "_timestamp",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "_buyer",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "_seller",
                "type": "address"
              }
            ],
            "internalType": "struct Exchange.OptionInfo",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
    ],
    functionName: 'requestOption',
    args: [index, true, utils.parseUnits(debouncedStrike.toString(), "ether"), parseInt(Math.floor(Date.now() / 1000) + 100)],
    enabled: Boolean(debouncedStrike) && Boolean(debouncedExpiration) && Boolean(debouncedLeverage),
  })

  const { data, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <div className="flex flex-shrink-0 flex-col">
      <div className="tabs w-full flex-grow-0">
        <button className="tab tab-lifted tab-active tab-border-none tab-lg flex-1"><b className="mr-2">Put</b></button>
        <button className="tab tab-lifted tab-border-none tab-lg flex-1" onClick={setCallActive}>Call</button>
      </div>
      <div className="card bg-base-100 rounded-tl-none shadow-xl">
        <div className="card-body pt-5">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              write?.()
            }}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Strike</span>
              </label>
              <label className="input-group">
                <input
                  id="strike"
                  type="number"
                  onChange={(e) => setStrike(e.target.value)}
                  placeholder="420"
                  className="input input-bordered w-full"
                  value={strike}
                />
                <span>
                  USDC
                </span>
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Expiration</span>
              </label>
              <label className="input-group">
                <input
                  id="expiration"
                  type="number"
                  onChange={(e) => setExpirationDays(e.target.value)}
                  placeholder="30"
                  className="input input-bordered w-full"
                  value={expirationDays}
                />
                <span>seconds</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Leverage</span>
              </label>
              <input
                id="leverage"
                type="range"
                min="0" max="30"
                onChange={(e) => setLeveraege(e.target.value)}
                className="range"
                value={leverage}
              />
              <div className="w-full flex justify-between text-xs px-2 mt-1">
                <span>1x</span>
                <span>5x</span>
                <span>10x</span>
                <span>15x</span>
                <span>20x</span>
                <span>25x</span>
                <span>30x</span>
              </div>
            </div>
            <div className="divider text-base-content/60 m-2">Put</div>
            <dl className="mb-4 space-y-2">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-base-600">Strike</dt>
                <dd className="text-sm font-medium text-base-900">{strike} ETH</dd>
              </div>
              <div className="flex items-center justify-between border-t border-base-200 pt-2">
                <dt className="flex items-center text-sm text-base-600">
                  <span>Expiration</span>
                </dt>
                <dd className="text-sm font-medium text-base-900">In {expirationDays} seconds</dd>
              </div>
              <div className="flex items-center justify-between border-t border-base-200 pt-2">
                <dt className="flex text-sm text-base-600">
                  <span>Leverage</span>
                  <a href="#" className="ml-2 flex-shrink-0 text-base-400 hover:text-base-500">
                    <span className="sr-only">Learn more about how tax is calculated</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                </dt>
                <dd className="text-sm font-medium text-base-900">{leverage}x</dd>
              </div>
            </dl>
            <button className={"btn btn-block space-x-2" + (isLoading ? " loading" : "")} disabled={!write || isLoading}>
              {isLoading ? 'Requesting Put' :
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
                  </svg>
                  Request Put
                </div>
              }
            </button>
            {isSuccess && (
              <div>
                Successfully request put!
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export function Call({ index, setPutActive }) {
  const [strike, setStrike] = React.useState(15);
  const [expirationDays, setExpirationDays] = React.useState(30);
  const [leverage, setLeveraege] = React.useState(10);

  const debouncedStrike = useDebounce(strike, 500);
  const debouncedExpiration = useDebounce(expirationDays, 500);
  const debouncedLeverage = useDebounce(leverage, 500);

  const { config } = usePrepareContractWrite({
    address: '0xcbB45f7A705238dC7BbC1eae5fD238FF2507cE9B',
    abi: [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_index",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "_type",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "_strike",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_expiry",
            "type": "uint256"
          }
        ],
        "name": "requestOption",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "_index",
                "type": "address"
              },
              {
                "internalType": "bool",
                "name": "_type",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "_strike",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "_premium",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "_expiry",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "_denomination",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "_timestamp",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "_buyer",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "_seller",
                "type": "address"
              }
            ],
            "internalType": "struct Exchange.OptionInfo",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
    ],
    functionName: 'requestOption',
    args: [index, false, utils.parseUnits(debouncedStrike.toString(), "ether"), parseInt(Math.floor(Date.now() / 1000) + 100)],
    enabled: Boolean(debouncedStrike) && Boolean(debouncedExpiration) && Boolean(debouncedLeverage),
  })

  const { data, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <div className="flex flex-shrink-0 flex-col">
      <div className="tabs w-full flex-grow-0">
        <button className="tab tab-lifted tab-border-none tab-lg flex-1" onClick={setPutActive}>Put</button>
        <button className="tab tab-lifted tab-active tab-border-none tab-lg flex-1"><b className="mr-2">Call</b></button>
      </div>
      <div className="card bg-base-100 rounded-tr-none shadow-xl">
        <div className="card-body pt-5">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              write?.()
            }}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Strike</span>
              </label>
              <label className="input-group">
                <input
                  id="strike"
                  type="number"
                  onChange={(e) => setStrike(e.target.value)}
                  placeholder="420"
                  className="input input-bordered w-full"
                  value={strike}
                />
                <span>
                  USDC
                </span>
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Expiration</span>
              </label>
              <label className="input-group">
                <input
                  id="expiration"
                  type="number"
                  onChange={(e) => setExpirationDays(e.target.value)}
                  placeholder="30"
                  className="input input-bordered w-full"
                  value={expirationDays}
                />
                <span>seconds</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Leverage</span>
              </label>
              <input
                id="leverage"
                type="range"
                min="0" max="30"
                onChange={(e) => setLeveraege(e.target.value)}
                className="range"
                value={leverage}
              />
              <div className="w-full flex justify-between text-xs px-2 mt-1">
                <span>1x</span>
                <span>5x</span>
                <span>10x</span>
                <span>15x</span>
                <span>20x</span>
                <span>25x</span>
                <span>30x</span>
              </div>
            </div>
            <div className="divider text-base-content/60 m-2">Call</div>
            <dl className="mb-4 space-y-2">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-base-600">Strike</dt>
                <dd className="text-sm font-medium text-base-900">{strike} ETH</dd>
              </div>
              <div className="flex items-center justify-between border-t border-base-200 pt-2">
                <dt className="flex items-center text-sm text-base-600">
                  <span>Expiration</span>
                </dt>
                <dd className="text-sm font-medium text-base-900">In {expirationDays} seconds</dd>
              </div>
              <div className="flex items-center justify-between border-t border-base-200 pt-2">
                <dt className="flex text-sm text-base-600">
                  <span>Leverage</span>
                  <a href="#" className="ml-2 flex-shrink-0 text-base-400 hover:text-base-500">
                    <span className="sr-only">Learn more about how tax is calculated</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                </dt>
                <dd className="text-sm font-medium text-base-900">{leverage}x</dd>
              </div>
            </dl>
            <button className={"btn btn-block space-x-2" + (isLoading ? " loading" : "")} disabled={!write || isLoading}>
              {isLoading ? 'Requesting Call' :
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
                  </svg>
                  Request Call
                </div>
              }
            </button>
            {isSuccess && (
              <div>
                Successfully requested call!
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export function Form({ index }) {
  const [putActive, setPut] = React.useState(false)

  const setPutActive = event => {
    setPut(true);
  };

  const setCallActive = event => {
    setPut(false);
  };

  return (
    <>
      {putActive ? <Put index={index} setCallActive={setCallActive} /> : <Call index={index} setPutActive={setPutActive} />}
    </>
  )
}

import * as React from 'react'
import { ArrowSmallUpIcon, ArrowSmallDownIcon } from '@heroicons/react/24/outline';
import useDebounce from 'components/helpers/useDebounce'
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useNetwork
} from 'wagmi'
import { contracts } from 'components/helpers/contracts'

type PropsRestake = {
  moduleAddress: any;
};

type PropsUnrestake = {
  moduleAddress: any;
};

type PropsModal = {
  _restakeActive: boolean;
  moduleAddress: any;
};

function Restake({ moduleAddress }: PropsRestake): JSX.Element {
  const [amount, setAmount] = React.useState('');
  const [token, setToken] = React.useState('')
  const debouncedAmount = useDebounce(amount)
  const debouncedToken = useDebounce(token)
  const { chain, chains } = useNetwork()

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: contracts['controller']['address'][chain?.name as keyof typeof contracts['controller']['address']] as `0x${string}`,
    abi: contracts.controller.abi,
    functionName: 'addModule',
    args: [debouncedToken, debouncedAmount],
    enabled: Boolean([debouncedToken, debouncedAmount]),
  })
  const { data, error, isError, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  if (isSuccess) {
    window.location.reload();
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          write?.()
        }}
      >
        <div className="form-control">
          <label className="label">
            <span className="label-text">Token</span>
          </label>
          <select className="select select-bordered" onChange={(e) => setToken(e.target.value)}>
            <option disabled selected>Select one</option>
            <option value="rsMock (0x00000000)">rsMock (0x00000000)</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Amount</span>
          </label>
          <label className="input-group">
            <input
              id="amount"
              type="number"
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="input input-bordered w-full"
              value={amount}
            />
            <span>{token.split(" (")[0]}</span>
          </label>
        </div>

        <div className="divider text-base-content/60 m-4">Overview</div>
        <dl className="mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <dt className="text-sm text-base-600">Supplied (current)</dt>
            <dd className="text-sm font-medium text-base-900">0 {token.split(" (")[0]}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-sm text-base-600">Supplied (expected)</dt>
            <dd className="text-sm font-medium text-base-900">0 {token.split(" (")[0]}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-base-200 pt-2">
            <dt className="flex text-sm text-base-600">
              <span>Used amount</span>
            </dt>
            <dd className="text-sm font-medium text-base-900">0 {token.split(" (")[0]}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-base-200 pt-2">
            <dt className="flex items-center text-sm text-base-600">
              <span>Variable APY (expected)</span>
            </dt>
            <dd className="text-sm font-medium text-base-900">0%</dd>
          </div>
        </dl>

        <button disabled={!write || isLoading} className="btn btn-block space-x-2 mt-4">
          <div className="inline-flex items-center">
            {isLoading ? 'Restaking...' :
              <>
                <ArrowSmallUpIcon className="w-6 h-6 mr-2" />
                Restake
              </>
            }
          </div>
        </button>

        {isSuccess && (
          <div>
            Successfully added module!
            <div>
              <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
            </div>
          </div>
        )}
        {(isPrepareError || isError) && (
          <div>Error: {(prepareError || error)?.message}</div>
        )}
      </form>
    </>
  )
}

function Unrestake({ moduleAddress }: PropsUnrestake): JSX.Element {
  const [amount, setAmount] = React.useState(0);

  return (<></>)
}

export function ActionModal({ _restakeActive, moduleAddress }: PropsModal): JSX.Element {
  const [supplied, setSupplied] = React.useState(0);
  const [supplyAPY, setSupplyAPY] = React.useState(0);
  const [minCollateraliation, setMinCollateraliation] = React.useState(0);

  const [restakeActive, setEnroll] = React.useState(_restakeActive)

  const setRestakeActive = () => {
    setEnroll(true);
  };

  const setUnrestakeActive = () => {
    setEnroll(false);
  };

  return (
    <div className="flex flex-shrink-0 flex-col">
      <div className="tabs w-full flex-grow-0">
        <button className={"tab tab-lifted tab-border-none tab-lg flex-1" + (restakeActive ? " tab-active font-bold mr-2" : "")} onClick={setRestakeActive}>Restake</button>
        <button className={"tab tab-lifted tab-border-none tab-lg flex-1" + (!restakeActive ? " tab-active font-bold mr-2" : "")} onClick={setUnrestakeActive}>Unrestake</button>
      </div>
      {
        restakeActive ?
          <div className="card bg-base-100 rounded-tl-none shadow-xl">
            <div className="card-body pt-5">
              <Restake moduleAddress={moduleAddress} />
            </div>
          </div> :
          <div className="card bg-base-100 rounded-tl-none shadow-xl">
            <div className="card-body pt-5">
              <Unrestake moduleAddress={moduleAddress} />
            </div>
          </div>
      }
    </div>
  )
}

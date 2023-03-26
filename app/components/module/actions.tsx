import * as React from 'react'
import { ArrowSmallUpIcon, ArrowSmallDownIcon } from '@heroicons/react/24/outline';
import useDebounce from 'components/helpers/useDebounce'
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useContractReads,
  useNetwork,
  useAccount,
  erc20ABI
} from 'wagmi'
import { contracts } from 'components/helpers/contracts'
import { ethers } from "ethers";

type PropsRestake = {
  moduleAddress: any;
  wrappers: any
};

type PropsUnrestake = {
  moduleAddress: any;
};

type PropsModal = {
  _restakeActive: boolean;
  moduleAddress: any;
  data: any;
};

function Restake({ moduleAddress, wrappers }: PropsRestake): JSX.Element {
  const [amount, setAmount] = React.useState('');
  const [wrapper, setWrapper] = React.useState('');
  const debouncedAmount = useDebounce(amount)
  const debouncedWrapper = useDebounce(wrapper)
  const { chain, chains } = useNetwork()
  const { address } = useAccount()

  // const {
  //   config,
  //   error: prepareError,
  //   isError: isPrepareError,
  // } = usePrepareContractWrite({
  //   address: contracts['controller']['address'][chain?.name as keyof typeof contracts['controller']['address']] as `0x${string}`,
  //   abi: contracts.controller.abi,
  //   functionName: 'addModule',
  //   args: [debouncedWrapper, debouncedAmount],
  //   enabled: Boolean([debouncedWrapper, debouncedAmount]),
  // })
  // const { data, error, isError, write } = useContractWrite(config)

  // const { isLoading, isSuccess } = useWaitForTransaction({
  //   hash: data?.hash,
  // })

  // if (isSuccess) {
  //   window.location.reload();
  // }

  /////////////////// symbols ///////////////////

  const wrapperContracts: any = []
  const underlyingContracts: any = []
  const wrapperData: any = []

  for (var i = 0; i < wrappers?.length; ++i) {
    const wrapperIndividual_symbol: any = {
      address: wrappers[i],
      abi: contracts.wrapper.abi,
      functionName: 'symbol',
    }

    const wrapperIndividual_balanceOf: any = {
      address: wrappers[i],
      abi: contracts.wrapper.abi,
      functionName: 'balanceOf',
      args: [address],
    }

    const wrapperIndividual_wrapped: any = {
      address: wrappers[i],
      abi: contracts.wrapper.abi,
      functionName: 'wrapped'
    }

    wrapperContracts.push(wrapperIndividual_symbol, wrapperIndividual_balanceOf, wrapperIndividual_wrapped)
  }

  const getWrapperData: any = useContractReads({
    contracts: wrapperContracts,
    onError(error) {
      console.log('Error', error)
    },
  })

  for (let i = 0; i < getWrapperData.data?.length; i += 3) {
    const chunk: any = getWrapperData.data.slice(i, i + 3);

    wrapperData.push({
      symbol_wrapped: chunk[0],
      symbol_underlying: chunk[0].substring(2),
      balance_wrapper: chunk[1],
      balance_underlying: 0,
      decimals_underlying: 18,
      address: wrappers[i / 3],
      address_underlying: chunk[2]
    })

    const underlyingIndividual_balanceOf: any = {
      address: chunk[2],
      abi: erc20ABI,
      functionName: 'balanceOf',
      args: [address],
    }

    underlyingContracts.push(underlyingIndividual_balanceOf)
  }

  const getUnderlyingData: any = useContractReads({
    contracts: underlyingContracts,
    onError(error) {
      console.log('Error', error)
    },
  })

  for (let i = 0; i < getUnderlyingData.data?.length; ++i) {
    wrapperData[i].balance_underlying = ethers.utils.formatUnits(getUnderlyingData.data[i], wrapperData[i].decimals_underlying)
  }

  //////////

  const approve_tx = usePrepareContractWrite({
    address: wrapperData[Number(wrapper)].address_underlying,
    abi: erc20ABI,
    functionName: 'approve',
    args: [wrapperData[Number(wrapper)].address, ethers.constants.MaxUint256],
  })

  const write_approve_tx = useContractWrite(approve_tx.config)

  const status_approve_tx = useWaitForTransaction({
    hash: write_approve_tx.data?.hash,
  })

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          write_approve_tx.write?.()
        }}
      >
        <div className="form-control">
          <label className="label">
            <span className="label-text">Token</span>
          </label>
          <select className="select select-bordered" defaultValue="99" onChange={(e) => setWrapper(e.target.value)}>
            <option disabled value="99">Select one</option>
            {wrapperData.map((wrapper: any, index: number) => (
              <option key={index} value={index}>{wrapper.symbol_wrapped + " (" + (wrapper.address.substring(0, 32)) + '...' + ")"}</option>
            ))}
          </select>
        </div>

        {wrapper ?
          <>
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
                <span>{wrapperData[Number(wrapper)].symbol_wrapped}</span>
              </label>
            </div>

            <div className="divider text-base-content/60 m-4">Overview</div>
            <dl className="mb-4 space-y-2">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-base-600">Balance underlying</dt>
                <dd className="text-sm font-medium text-base-900">{wrapperData[Number(wrapper)].balance_underlying + " " + wrapperData[Number(wrapper)].symbol_underlying}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-base-600">Balance wrapped (current)</dt>
                <dd className="text-sm font-medium text-base-900">{wrapperData[Number(wrapper)].balance_wrapper + " " + wrapperData[Number(wrapper)].symbol_wrapped}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-base-600">Balance wrapped (after)</dt>
                <dd className="text-sm font-medium text-base-900">{(parseInt(wrapperData[Number(wrapper)].balance_wrapper) || 0 + parseInt(amount) || 0)  + " " + wrapperData[Number(wrapper)].symbol_wrapped}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-base-200 pt-2">
                <dt className="flex text-sm text-base-600">
                  <span>Used amount</span>
                </dt>
                <dd className="text-sm font-medium text-base-900">0 {wrapperData[Number(wrapper)].symbol_wrapped}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-base-200 pt-2">
                <dt className="flex items-center text-sm text-base-600">
                  <span>Variable APY (after)</span>
                </dt>
                <dd className="text-sm font-medium text-base-900">0%</dd>
              </div>
            </dl>
          </>
          : ''
        }

        <button disabled={!write_approve_tx.write || status_approve_tx.isLoading} className="btn btn-block space-x-2 mt-4">
          <div className="inline-flex items-center">
            {status_approve_tx.isLoading ? 'Restaking...' :
              <>
                <ArrowSmallUpIcon className="w-6 h-6 mr-2" />
                Restake
              </>
            }
          </div>
        </button>

        {status_approve_tx.isSuccess && (
          <div>
            Successfully added module!
            <div>
              <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
            </div>
          </div>
        )}
        {(approve_tx.isError) && (
          <div>Error: {approve_tx.error?.message}</div>
        )}
      </form>
    </>
  )
}

function Unrestake({ moduleAddress }: PropsUnrestake): JSX.Element {
  const [amount, setAmount] = React.useState(0);

  return (<></>)
}

export function ActionModal({ _restakeActive, moduleAddress, data }: PropsModal): JSX.Element {
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
              <Restake moduleAddress={moduleAddress} wrappers={data.wrappers} />
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

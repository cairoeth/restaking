import * as React from 'react'
import { ArrowSmallUpIcon, ArrowSmallDownIcon } from '@heroicons/react/24/outline';
import { RocketLaunchIcon } from '@heroicons/react/24/solid';

export function Subscribe({ status, module, supplied, supplyAPY, minCollateraliation }) {
  const [amount, setAmount] = React.useState(0);

  return (
    <>
      {status ?
        <form
          onSubmit={(e) => {
            write?.()
          }}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Supply amount</span>
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
              <span>USD</span>
            </label>
          </div>
          <div className="divider text-base-content/60 m-4">Overview</div>
          <dl className="mb-4 space-y-2">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-base-600">Supplied</dt>
              <dd className="text-sm font-medium text-base-900">{supplied} USD</dd>
            </div>
            <div className="flex items-center justify-between border-t border-base-200 pt-2">
              <dt className="flex items-center text-sm text-base-600">
                <span>Variable APY</span>
              </dt>
              <dd className="text-sm font-medium text-base-900">{supplyAPY}%</dd>
            </div>
            <div className="flex items-center justify-between border-t border-base-200 pt-2">
              <dt className="flex text-sm text-base-600">
                <span>Min. collateralization</span>
              </dt>
              <dd className="text-sm font-medium text-base-900">{minCollateraliation}%</dd>
            </div>
          </dl>
          <button className="btn btn-block space-x-2 mt-4">
            <div className="flex items-center">
              <ArrowSmallUpIcon className="w-6 h-6 mr-2" />
              Subscribe
            </div>
          </button>
        </form>
        :
        <div>
          <div className="items-center space-x-3">
            <h3 className="truncate text-lg font-bold">You must be enrolled as a validator to subscribe!</h3>
          </div>
          <a href='/enroll' className="btn btn-primary btn-block space-x-2 mt-4">
            <div className="flex items-center">
              <RocketLaunchIcon className="w-6 h-6 mr-2" />
              Enroll
            </div>
          </a>
        </div>
      } </>
  )
}

export function Delegate({supplied, module, supplyAPY, minCollateraliation}) {
  const [amount, setAmount] = React.useState(0);

  return (
    <form
      onSubmit={(e) => {
        write?.()
      }}>
      <div className="form-control">
        <label className="label">
          <span className="label-text">{module.symbol} Amount</span>
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
          <span>USD</span>
        </label>
      </div>
      <div className="divider text-base-content/60 m-4">Overview</div>
      <dl className="mb-4 space-y-2">
        <div className="flex items-center justify-between">
          <dt className="text-sm text-base-600">Supplied</dt>
          <dd className="text-sm font-medium text-base-900">{supplied} USD</dd>
        </div>
        <div className="flex items-center justify-between border-t border-base-200 pt-2">
          <dt className="flex items-center text-sm text-base-600">
            <span>Variable APY</span>
          </dt>
          <dd className="text-sm font-medium text-base-900">{supplyAPY}%</dd>
        </div>
        <div className="flex items-center justify-between border-t border-base-200 pt-2">
          <dt className="flex text-sm text-base-600">
            <span>Min. collateralization</span>
          </dt>
          <dd className="text-sm font-medium text-base-900">{minCollateraliation}%</dd>
        </div>
      </dl>
      <button className="btn btn-block space-x-2 mt-4">
        <div className="flex items-center">
          <ArrowSmallDownIcon className="w-6 h-6 mr-2" />
          Withdraw
        </div>
      </button>
    </form>
  )
}

export function SubscribeDelegateModal({ enrolled, _subscribeActive, module }) {
  const [supplied, setSupplied] = React.useState(0);
  const [supplyAPY, setSupplyAPY] = React.useState(0);
  const [minCollateraliation, setMinCollateraliation] = React.useState(0);

  const [subscribeActive, setEnroll] = React.useState(_subscribeActive)

  const setSubscribeActive = event => {
    setEnroll(true);
  };

  const setDelegateActive = event => {
    setEnroll(false);
  };

  return (
    <div className="flex flex-shrink-0 flex-col">
      <div className="tabs w-full flex-grow-0">
        <button className={"tab tab-lifted tab-border-none tab-lg flex-1" + (subscribeActive ? " tab-active font-bold mr-2" : "")} onClick={setSubscribeActive}>Subscribe</button>
        <button className={"tab tab-lifted tab-border-none tab-lg flex-1" + (!subscribeActive ? " tab-active font-bold mr-2" : "")} onClick={setDelegateActive}>Delegate</button>
      </div>
      {
        subscribeActive ?
          <div className="card bg-base-100 rounded-tl-none shadow-xl">
            <div className="card-body pt-5">
              <Subscribe status={enrolled} module={module} />
            </div>
          </div> :
          <div className="card bg-base-100 rounded-tl-none shadow-xl">
            <div className="card-body pt-5">
              <Delegate module={module} />
            </div>
          </div>
      }
    </div>
  )
}

import * as React from 'react'
import { CalculatorIcon, DocumentChartBarIcon, ChartBarIcon, CurrencyDollarIcon, UserGroupIcon, BugAntIcon, ChartBarSquareIcon } from '@heroicons/react/24/solid';
import Image from 'next/image'

type Props = {
  data: any;
};

export function Bar({ data }: Props): JSX.Element {
  return (
    <div className="navbar bg-base-100 shadow-xl rounded-xl ">
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        <Image className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-300" width={600} height={600} src={data.image} alt={data.name} />
        <div className="flex-1 truncate ml-1">
          <div className="flex items-center space-x-3">
            <h3 className="truncate text-lg font-bold">{data.name}</h3>
          </div>
          <p className="mt-1 truncate text-sm text-gray-500">{data.address}</p>
        </div>
      </div>
      <div className="flex-none gap-2">
        <div className="stats stats-vertical lg:stats-horizontal shadow-0 bg-transparent overflow-hidden">
          <div className="stat py-1">
            <div className="stat-title">
              APY
            </div>
            <div className="stat-val">
              <div className="flex items-center">
                <CalculatorIcon className="w-5 h-5 mr-2" />
                <h2 className='font-bold'>{data.APY}%</h2>
              </div>
            </div>
          </div>

          <div className="stat py-1">
            <div className="stat-title">
              TVL
            </div>
            <div className="stat-val">
              <div className="flex items-center">
                <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                <h2 className='font-bold'>${data.tvl}</h2>
              </div>
            </div>
          </div>

          <div className="stat py-1">
            <div className="stat-title">
              Restakers
            </div>
            <div className="stat-val">
              <div className="flex items-center">
                <UserGroupIcon className="w-5 h-5 mr-2" />
                <h2 className='font-bold'>{data.restakers}</h2>
              </div>
            </div>
          </div>

          <div className="stat py-1">
            <div className="stat-title">
              Slashing Rate
            </div>
            <div className="stat-val">
              <div className="flex items-center">
                <BugAntIcon className="w-5 h-5 mr-2" />
                <h2 className='font-bold'>{data.slashing}%</h2>
              </div>
            </div>
          </div>

          <div className="stat py-1">
            <div className="stat-title">
              Rewards available
            </div>
            <div className="stat-val">
              <div className="flex items-center">
                <label htmlFor="rewards-modal" className="btn btn-xs btn-primary btn-outline align-middle">
                  Claim
                </label>
              </div>
            </div>
          </div>

          <div className="stat py-1">
            <div className="stat-title">
              Rewards total
            </div>
            <div className="stat-val">
              <div className="flex items-center">
                <label htmlFor="rewards-modal" className="btn btn-xs btn-secondary btn-outline align-middle">
                  Check
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

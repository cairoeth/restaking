import React from 'react'

import { Bar } from "components/module/bar";
import { Activity } from 'components/module/activity'
import { ActionModal } from 'components/module/actions'

import { useContractRead, useContractReads, useAccount, useNetwork } from 'wagmi'
import { contracts } from "components/helpers/contracts"

export function ModuleContent({ module }: { module: string }) {
  var data: any = []
  const { address, isConnecting, isDisconnected } = useAccount()
  const { chain, chains } = useNetwork()

  const moduleContract: any = {
    address: module,
    abi: contracts.module.abi,
  }

  const moduleData: any = useContractReads({
    contracts: [
      {
        ...moduleContract,
        functionName: 'name',
      },
      {
        ...moduleContract,
        functionName: 'getWrappers',
      },
      {
        ...moduleContract,
        functionName: 'image',
      },
    ],
    onError(error) {
      console.log('Error', error)
    },
  })

  if (moduleData.data != undefined && moduleData.data[0] != null) {
    data = {
      wrappers: moduleData.data[1],
      image: moduleData.data[2],
      name: moduleData.data[0],
      address: module,
      APY: '10.14',
      tvl: '<100k',
      restakers: '69',
      available: '8.144',
      total: '16.288',
      slashing: '0.44',
      symbol: 'OP',
    }
  } else {
    return (
      <div>
        <h1>Module not found</h1>
      </div>
    )
  }

  return (
    <>
      <div className='col-span-3'>
        <Bar data={data} />
      </div>
      <div className="col-span-2">
        <Activity module={module} />
      </div>
      <div className="col-span-1 h-full">
        <ActionModal _restakeActive={true} moduleAddress={module} data={data} />
      </div>
    </>
  );
};

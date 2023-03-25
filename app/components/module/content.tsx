import React from 'react'

import { Bar } from "components/module/bar";
import { Activity } from 'components/module/activity'
import { SubscribeDelegateModal } from 'components/module/actions'

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
        functionName: 'getTokens',
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
      slug: moduleData.data[0],
      symbol: 'OP',
      blockchain: chain?.name,
      image: moduleData.data[2],
      apr: '10.14',
      tvl: '8.33M',
      rewards7: '8.144',
      rewards14: '16.288',
      rewards31: '32.576',
      slashing: '0.44',
      validators: '69',
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
        <SubscribeDelegateModal restaked={false} _subscribeActive={true} module={data} />
      </div>
    </>
  );
};

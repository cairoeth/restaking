import { UserIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline"
import Image from 'next/image'
import { ColumnRestaked } from "components/dashboard/column"
import Link from 'next/link'
import { useContractRead, useContractReads, useAccount, erc20ABI, useNetwork } from 'wagmi'
import { contracts } from "components/helpers/contracts"
import { ethers } from "ethers";

export function RestakedStake() {
  const { chain } = useNetwork()
  const { address } = useAccount()
  const wrapperContracts: any = []
  var modules: any = []

  const controllerContract: any = {
    address: contracts['controller']['address'][chain?.name as keyof typeof contracts['controller']['address']] as `0x${string}`,
    abi: contracts.controller.abi,
  }

  const controllerData: any = useContractReads({
    contracts: [
      {
        ...controllerContract,
        functionName: 'allWrappers',
      },
      {
        ...controllerContract,
        functionName: 'allModules',
      },
    ],
    onError(error) {
      console.log('Error', error)
    },
  })

  console.log(controllerData?.data)

  // loop over wrappers
  for (let i = 0; i < controllerData?.data[0]?.length; i++) {
    const wrapperContract: any = {
      address: controllerData?.data[0][i],
      abi: contracts.wrapper.abi,
    }

    // loop over modules
    for (let j = 0; j < controllerData?.data[1]?.length; j++) {
      const moduleContract: any = {
        address: controllerData?.data[1][j],
        abi: contracts.module.abi,
      }

      const wrapperContractRestaked = {
        ...wrapperContract,
        functionName: 'restakedAmount',
        args: [address, controllerData?.data[1][j]]
      }

      const wrapperContractSymbol = {
        ...wrapperContract,
        functionName: 'symbol',
      }

      const moduleContractName = {
        ...moduleContract,
        functionName: 'name',
      }

      const moduleContractImage = {
        ...moduleContract,
        functionName: 'image',
      }

      wrapperContracts.push(wrapperContractRestaked, wrapperContractSymbol, moduleContractName, moduleContractImage)
    }
  }

  const wrappersData: any = useContractReads({
    contracts: wrapperContracts,
    onError(error) {
      console.log('Error', error)
    },
  })

  for (let i = 0; i < wrappersData?.data?.length; i += 4) {
    const chunk: any = wrappersData?.data?.slice(i, i + 4);
    const restakedAmount: any = ethers.utils.formatUnits(chunk[0], 18)

    if (restakedAmount > 0) {
      modules.push({
        image: chunk[3],
        name: chunk[2],
        restakedAmount: restakedAmount,
        symbol: chunk[1],
        address: controllerData?.data[1][i / 4],
        underlying: controllerData?.data[0][i / 4],
        underlying_symbol: chunk[1].substring(2)
      })
    } else {
      continue
    }
  }

  return (
    <div className="card bg-base-100 shadow-xl mb-10">
      <div className="card-body">
        <h2 className="card-title">
          <UserIcon className="w-6 h-6" />
          Restaked assets
        </h2>
        <div className="overflow-x-auto max-h-min">
          {modules.length > 0 ?
            <table className="table w-full text-center">
              <tbody>
                {modules.map((module: any, index: number) => (
                  <tr key={index}>
                    <td className='text-left'>
                      <Link href={'/module/' + module.address}>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12 rounded-full">
                              <Image width={600} height={600} src={module.image} alt={"Image of module " + module.name} />
                            </div>
                          </div>
                          <div>
                            <div className="text-lg font-bold">{module.name}</div>
                            <div className="text-base text-left text-gray-500">{chain?.network}</div>
                          </div>
                        </div>
                      </Link>
                    </td>
                    <ColumnRestaked first="Restaked amount" second={module.restakedAmount + ' ' + module.symbol} third={'$' + (parseFloat(module.restakedAmount) * 1.0)} slug={module.address} />
                    <ColumnRestaked first="Underyling token" second={module.underlying} third={module.underlying_symbol} slug={module.address} />
                    <td>
                      <div className="flex-none">
                        <Link className="btn btn-sm btn-primary btn-outline btn-circle align-middle" href={'/module/' + module.address}>
                          <PlusIcon className="h-6 w-6" />
                        </Link>
                        <Link className="btn btn-sm btn-primary btn-outline btn-circle ml-4 align-middle" href={'/module/' + module.address}>
                          <MinusIcon className="h-6 w-6" />
                        </Link>
                        <Link className="btn btn-sm btn-secondary btn-outline ml-4 align-middle" href={'/module/' + module.address}>
                          Claim
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            :
            <div className="flex w-full items-center justify-between space-x-6 p-6">
              <div className="flex-1 truncate">
                <div className="flex space-x-3 place-content-center">
                  <div className="text-lg">Not restaked in any modules.</div>
                  <Link className="btn btn-sm btn-secondary btn-outline ml-4 align-middle" href='/modules'>
                    Restake now
                  </Link>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

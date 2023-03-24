import { PuzzlePieceIcon, PlusIcon, MinusIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import Image from 'next/image'
import { ColumnWrappers } from "components/dashboard/column"
import Link from 'next/link'
import { CreateWrapperModal } from 'components/dashboard/modals/createWrapper'
import { useContractRead, useContractReads, useAccount } from 'wagmi'
import { contracts } from 'components/helpers/contracts'

type Props = {
  data: any
  isError: boolean
  isLoading: boolean
}

export function AllTokens() {
  const { address, isConnecting, isDisconnected } = useAccount()
  var wrappers: any = []

  const allWrappersCall: Props = useContractRead({
    address: contracts.controller.address as `0x${string}`,
    abi: contracts.controller.abi,
    functionName: 'allWrappers',
  })

  for (var i = 0; i < allWrappersCall.data.length; ++i) {
    const wrapperContract: any = {
      address: allWrappersCall.data[i],
      abi: contracts.wrapper.abi,
    }

    const wrapperData: any = useContractReads({
      contracts: [
        {
          ...wrapperContract,
          functionName: 'name',
        },
        {
          ...wrapperContract,
          functionName: 'symbol',
        },
        {
          ...wrapperContract,
          functionName: 'wrapped',
        },
        {
          ...wrapperContract,
          functionName: 'totalSupply',
        },
        {
          ...wrapperContract,
          functionName: 'balanceOf',
          args: [address],
        },
      ],
    })

    wrappers.push({
      name: wrapperData.data[0],
      symbol: wrapperData.data[1],
      image: "https://generative-placeholders.glitch.me/image?width=600&height=300&img=" + wrapperData.data[0],
      address: allWrappersCall.data[i],
      underlying: wrapperData.data[2],
      totalSupply: wrapperData.data[3],
      yourBalance: wrapperData.data[4],
    })
  }

  return (
    <>
      <div className="card bg-base-100 shadow-xl mb-10">
        <div className="card-body">
          <div className="card-title flex items-center justify-between mb-6">
            <div className="relative inline-block text-left">
              <div className="inline-flex mr-4">
                <h2>
                  <PuzzlePieceIcon className="inline-flex w-6 h-6 mr-1.5 mb-1" />
                  All wrappers
                </h2>
              </div>
            </div>

            <div className="hidden sm:flex sm:items-baseline sm:space-x-8">
              <div className="relative inline-block text-left">
                <div className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  <label htmlFor="create-wrapper-modal" className="btn btn-sm btn-primary btn-outline ml-4 align-middle">
                    Create Wrapper
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto max-h-min">
            {wrappers.length > 0 ?
              <table className="table w-full text-center">
                <tbody>
                  {wrappers.map((wrapper: any, index: number) => (
                    <tr key={index}>
                      <td className='text-left'>
                        <Link href={'https://goerli.etherscan.io/address/' + wrapper.address}>
                          <div className="flex items-center space-x-3">
                            <div className="avatar">
                              <div className="mask mask-squircle w-12 h-12 rounded-full">
                                <Image width={600} height={600} src={wrapper.image} alt={"Image of wrapper " + wrapper.name} />
                              </div>
                            </div>
                            <div>
                              <div className="text-lg font-bold">{wrapper.name}</div>
                              <div className="text-base text-left text-gray-500">{wrapper.symbol}</div>
                            </div>
                          </div>
                        </Link>
                      </td>
                      <ColumnWrappers first="Address" second={(wrapper.address.substring(0, 18)) + '...'} third={''} link={'https://goerli.etherscan.io/address/' + wrapper.address} />
                      <ColumnWrappers first="Underlying" second={(wrapper.underlying.substring(0, 18)) + '...'} third={''} link={'https://goerli.etherscan.io/address/' + wrapper.underlying} />
                      <ColumnWrappers first="Total Supply" second={wrapper.totalSupply + ' ' + wrapper.symbol} third={''} link={'#'} />
                      <ColumnWrappers first="Your balance" second={wrapper.yourBalance + ' ' + wrapper.symbol} third={''} link={'#'} />
                      <td>
                        <div className="flex-none">
                          <button className="btn btn-sm btn-secondary btn-outline ml-4 align-middle">
                            Explore modules
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              : 'No wrappers created'}
          </div>
        </div>
      </div>
      <CreateWrapperModal />
    </>
  )
}

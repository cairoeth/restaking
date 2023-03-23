import { PuzzlePieceIcon, PlusIcon, MinusIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import Image from 'next/image'
import { Column } from "components/dashboard/column"
import Link from 'next/link'
import { CreateWrapperModal } from 'components/dashboard/modals/createWrapper'
import { useContractRead } from 'wagmi'
import { contracts } from 'components/helpers/contracts'

export function AllTokens() {
  // const { data, isError, isLoading } = useContractRead({
  //   address: contracts.controller.address as `0x${string}`,
  //   abi: contracts.controller.abi,
  //   functionName: 'getHunger',
  // })

  var modules: any = [
    {
      name: 'rsEthereum',
      symbol: 'rsETH',
      image: "https://generative-placeholders.glitch.me/image?width=600&height=300&img=rsETH",
      address: '0x741cB6A6a8dC16363...',
      underlying: '0x741cB6A6a8dC16363...',
      totalSupply: '17,729',
      yourBalance: '0',
    },
  ]

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
            {modules.length > 0 ?
              <table className="table w-full text-center">
                <tbody>
                  {modules.map((module: any, index: number) => (
                    <tr key={index}>
                      <td className='text-left'>
                        <Link href={'/module/' + module.name}>
                          <div className="flex items-center space-x-3">
                            <div className="avatar">
                              <div className="mask mask-squircle w-12 h-12 rounded-full">
                                <Image width={600} height={600} src={module.image} alt={"Image of module " + module.name} />
                              </div>
                            </div>
                            <div>
                              <div className="text-lg font-bold">{module.name}</div>
                              <div className="text-base text-left text-gray-500">{module.symbol}</div>
                            </div>
                          </div>
                        </Link>
                      </td>
                      <Column first="Address" second={module.address} third={''} slug={module.slug} />
                      <Column first="Underlying" second={module.underlying} third={''} slug={module.slug} />
                      <Column first="Total Supply" second={module.totalSupply + ' ' + module.symbol} third={''} slug={module.slug} />
                      <Column first="Your balance" second={module.yourBalance + ' ' + module.symbol} third={''} slug={module.slug} />
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

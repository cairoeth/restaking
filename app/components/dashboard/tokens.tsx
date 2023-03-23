import { PuzzlePieceIcon, PlusIcon, MinusIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import Image from 'next/image'
import { Column } from "components/dashboard/column"
import Link from 'next/link'
import { CreateWrapperModal } from 'components/dashboard/modals/createWrapper'

export function AllTokens() {
  var modules: any = [
    // {
    //   slug: 'FVM',
    //   symbol: 'ETH',
    //   blockchain: 'Ethereum Mainnet',
    //   image: 'https://storage.googleapis.com/ethglobal-api-production/organizations%2F9zj01%2Flogo%2F1677081097389_FVM%20square%20logo.png',
    //   stake: '218,094.32',
    //   stakeUSD: '21,200',
    //   rewardsTotal: '17,729',
    //   rewardsTotalUSD: '155',
    //   rewardsAvailable: '1,952',
    //   rewardsAvailableUSD: '85',
    //   delegatee: '0x741cB6...',
    //   ens: '👅🌈👅.eth',
    //   apy: '15.84',
    //   apyPerformance: '+10.27'
    // },
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
                  <label htmlFor="create-wrapper-modal" className="btn btn-sm btn-secondary btn-outline ml-4 align-middle">
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
                        <Link href={'/module/' + module.slug}>
                          <div className="flex items-center space-x-3">
                            <div className="avatar">
                              <div className="mask mask-squircle w-12 h-12 rounded-full">
                                <Image width={600} height={600} src={module.image} alt={"Image of module " + module.slug} />
                              </div>
                            </div>
                            <div>
                              <div className="text-lg font-bold">{module.slug}</div>
                              <div className="text-base text-left text-gray-500">{module.blockchain}</div>
                            </div>
                          </div>
                        </Link>
                      </td>
                      <Column first="Staked" second={module.stake + ' ' + module.symbol} third={'$' + module.stakeUSD} slug={module.slug} />
                      <Column first="Total Rewards" second={module.rewardsTotal + ' ' + module.symbol} third={'$' + module.rewardsTotalUSD} slug={module.slug} />
                      <Column first="Available Rewards" second={module.rewardsAvailable + ' ' + module.symbol} third={'$' + module.rewardsAvailableUSD} slug={module.slug} />
                      <Column first="Delegatee" second={module.delegatee} third={module.ens} slug={module.slug} />
                      <Column first="APY" second={module.apy + '%'} third={module.apyPerformance + '%'} slug={module.slug} />
                      <td>
                        <div className="flex-none">
                          <button className="btn btn-sm btn-primary btn-outline btn-circle align-middle">
                            <PlusIcon className="h-6 w-6" />
                          </button>
                          <button className="btn btn-sm btn-primary btn-outline btn-circle ml-4 align-middle">
                            <MinusIcon className="h-6 w-6" />
                          </button>
                          <button className="btn btn-sm btn-secondary btn-outline ml-4 align-middle">
                            Claim
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

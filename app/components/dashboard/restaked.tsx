import { UserIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline"
import Image from 'next/image'
import { ColumnRestaked } from "components/dashboard/column"
import Link from 'next/link'

export function RestakedStake() {
  var modules: any = [
    // {
    //   slug: 'Optimism',
    //   symbol: 'OP',
    //   blockchain: 'Ethereum Mainnet',
    //   image: 'https://gateway.optimism.io/static/media/optimism.caeb9392.svg',
    //   stake: '818,094.32',
    //   stakeUSD: '25,500',
    //   rewardsTotal: '30,456',
    //   rewardsTotalUSD: '60',
    //   rewardsAvailable: '11,122',
    //   rewardsAvailableUSD: '22',
    //   accuracy: '99.22',
    //   accuracyPerformance: '-0.04',
    //   apy: '7.69',
    //   apyPerformance: '+4.79'
    // },
    // {
    //   slug: 'UMA',
    //   symbol: 'UMA',
    //   blockchain: 'Ethereum Mainnet',
    //   image: 'https://storage.googleapis.com/ethglobal-api-production/organizations%2Ffp1x1%2Flogo%2F1664750381528_uma.jpeg',
    //   stake: '218,094.32',
    //   stakeUSD: '21,200',
    //   rewardsTotal: '17,729',
    //   rewardsTotalUSD: '155',
    //   rewardsAvailable: '1,952',
    //   rewardsAvailableUSD: '85',
    //   accuracy: '99.89',
    //   accuracyPerformance: '+0.02',
    //   apy: '15.84',
    //   apyPerformance: '+10.27'
    // },
  ]

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
                    <ColumnRestaked first="Staked" second={module.stake + ' ' + module.symbol} third={'$' + module.stakeUSD} slug={module.slug} />
                    <ColumnRestaked first="Total Rewards" second={module.rewardsTotal + ' ' + module.symbol} third={'$' + module.rewardsTotalUSD} slug={module.slug} />
                    <ColumnRestaked first="Available Rewards" second={module.rewardsAvailable + ' ' + module.symbol} third={'$' + module.rewardsAvailableUSD} slug={module.slug} />
                    <ColumnRestaked first="Accuracy" second={module.accuracy + '%'} third={module.accuracyPerformance + '%'} slug={module.slug} />
                    <ColumnRestaked first="APY" second={module.apy + '%'} third={module.apyPerformance + '%'} slug={module.slug} />
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

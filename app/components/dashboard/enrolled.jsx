import { UserIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline"
import Image from 'next/image'
import { Column } from "components/dashboard/table/column"

export function EnrolledStake() {
    var modules = [
        {
            slug: 'Optimism',
            symbol: 'OP',
            blockchain: 'Ethereum Mainnet',
            image: 'https://gateway.optimism.io/static/media/optimism.caeb9392.svg',
            stake: '818,094.32',
            stakeUSD: '25,500',
            rewardsTotal: '30,456',
            rewardsTotalUSD: '60',
            rewardsAvailable: '11,122',
            rewardsAvailableUSD: '22',
            accuracy: '99.22',
            accuracyPerformance: '-0.04',
            apy: '7.69',
            apyPerformance: '+4.79'
        },
        {
            slug: 'UMA',
            symbol: 'UMA',
            blockchain: 'Ethereum Mainnet',
            image: 'https://storage.googleapis.com/ethglobal-api-production/organizations%2Ffp1x1%2Flogo%2F1664750381528_uma.jpeg',
            stake: '218,094.32',
            stakeUSD: '21,200',
            rewardsTotal: '17,729',
            rewardsTotalUSD: '155',
            rewardsAvailable: '1,952',
            rewardsAvailableUSD: '85',
            accuracy: '99.89',
            accuracyPerformance: '+0.02',
            apy: '15.84',
            apyPerformance: '+10.27'
        },
    ]

    return (
        <div className="card bg-base-100 shadow-xl mb-10">
            <div className="card-body">
                <h2 className="card-title">
                    <UserIcon className="w-6 h-6" />
                    Enrolled stake
                </h2>
                <div className="overflow-x-auto max-h-min">
                    <table className="table w-full text-center">
                        <tbody>
                            {modules.map((module, index) => (
                            <tr key={index}>
                                <td className='text-left'>
                                    <a href={'/module/' + module.slug}>
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
                                    </a>
                                </td>
                                <Column first="Staked" second={module.stake + ' ' + module.symbol} third={'$' + module.stakeUSD} />
                                <Column first="Total Rewards" second={module.rewardsTotal + ' ' + module.symbol} third={'$' + module.rewardsTotalUSD} />
                                <Column first="Available Rewards" second={module.rewardsAvailable + ' ' + module.symbol} third={'$' + module.rewardsAvailableUSD} />
                                <Column first="Accuracy" second={module.accuracy + '%'} third={module.accuracyPerformance + '%'} />
                                <Column first="APY" second={module.apy + '%'} third={module.apyPerformance + '%'} />
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
                </div>
            </div>
        </div>
    )
}
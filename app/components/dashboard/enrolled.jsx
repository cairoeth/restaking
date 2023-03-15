import { UserIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline"
import Image from 'next/image'

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
                                            <div className="mask mask-squircle w-12 h-12">
                                                <Image width={600} height={600} src={module.image} alt={"Image of module " + module.slug} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{module.slug}</div>
                                            <div className="text-xs text-left">{module.blockchain}</div>
                                        </div>
                                        </div>
                                    </a>
                                </td>
                                <td>
                                    <div>
                                        <div className="text-xs text-left">Staked</div>
                                        <div className="font-bold text-left">{module.stake} {module.symbol}</div>
                                        <div className="text-xs text-left">${module.stakeUSD}</div>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <div className="text-xs text-left">Total Rewards</div>
                                        <div className="font-bold text-left">{module.rewardsTotal} {module.symbol}</div>
                                        <div className="text-xs text-left">${module.rewardsTotalUSD}</div>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <div className="text-xs text-left">Available Rewards</div>
                                        <div className="font-bold text-left">{module.rewardsAvailable} {module.symbol}</div>
                                        <div className="text-xs text-left">${module.rewardsAvailableUSD}</div>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <div className="text-xs text-left">Accuracy</div>
                                        <div className="font-bold text-left">{module.accuracy}%</div>
                                        <div className="text-xs text-left">{module.accuracyPerformance}%</div>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <div className="text-xs text-left">APY</div>
                                        <div className="font-bold text-left">{module.apy}%</div>
                                        <div className="text-xs text-left">{module.apyPerformance}%</div>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex-none">
                                        <button className="btn btn-primary btn-outline btn-circle align-middle">
                                            <PlusIcon className="h-6 w-6" />
                                        </button>
                                        <button className="btn btn-primary btn-outline btn-circle ml-4 align-middle">
                                            <MinusIcon className="h-6 w-6" />
                                        </button>
                                        <button className="btn btn-secondary btn-outline ml-4 align-middle">
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
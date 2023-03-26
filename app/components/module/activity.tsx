import { SignalIcon } from '@heroicons/react/24/outline'
import { useContract, useNetwork, useProvider } from 'wagmi'
import { contracts } from "components/helpers/contracts"
import { useState, useEffect } from "react";

export function Activity({ module }: { module: string }) {
  const { chain, chains } = useNetwork()
  const provider = useProvider()
  const [activities, updateActivities] = useState([]);

  const moduleContract = useContract({
    address: contracts['controller']['address'][chain?.name as keyof typeof contracts['controller']['address']],
    abi: contracts.controller.abi,
    signerOrProvider: provider
  })

  const setActivities = async () => {
    let events = await moduleContract?.queryFilter('ModuleAdded', -800);
    let activitiesT: any = []

    if (events != undefined) {
      for (let i = 0; i < events.length; i++) {
        let timestamp = (await provider.getBlock(events[i].blockNumber)).timestamp;
        let date = new Date(timestamp * 1000);
        let dateFormatted = date.toISOString();
        let day = dateFormatted.slice(0, 10);
        let time = dateFormatted.slice(11, 19);

        let activity = {
          blockNumber: events[i].blockNumber,
          date: day,
          time: time + ' UTC',
          hash: events[i].transactionHash,
          event: events[i].event,
          data: events[i].args,
        }
        activitiesT.push(activity)
      }
    }

    updateActivities(activitiesT)
  }

  useEffect(() => {
    setActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          <SignalIcon className="w-6 h-6" />
          Activity (last 800 blocks)
        </h2>
        <div className="overflow-x-auto max-h-min">
          {activities.length > 0 ?
            <table className="table w-full text-center">
              <thead>
                <tr>
                  <th className='text-left'>Block</th>
                  <th>Hash</th>
                  <th>Event</th>
                  <th>Data </th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity: any, activityId: number) => (
                  <tr key={activityId}>
                    <td className='text-left'>
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-bold">#{activity.blockNumber}</div>
                          <div className="text-xs opacity-50 text-left">{activity.date}</div>
                          <div className="text-xs opacity-50 text-left">{activity.time}</div>
                        </div>
                      </div>
                    </td>
                    <td>{(activity.hash.substring(0, 18)) + '...'}</td>
                    <td>{activity.event}</td>
                    <td>{activity.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            :
            <div className="flex w-full items-center justify-between space-x-6 p-6">
              <div className="flex-1 truncate">
                <div className="flex space-x-3 place-content-center">
                  <div className="text-lg font-bold">No activity &nbsp;😔</div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

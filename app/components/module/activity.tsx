import { SignalIcon } from '@heroicons/react/24/outline'

export function Activity() {
  const activities = [
    {
      checkpoint: '1',
      validator: '0x741cB6A6a8dC16363666462769D8dEc996311466',
      address: '0xe16C1623c1AA7D919cd2241d8b36d9E79C1Be2A2',
      publickey: '0xaa931f....bed0c7',
      date: '13 March 2023',
      time: '5:45:33 UTC',
      rewards: '3592',
      valid: 'Yes'
    },
  ]

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          <SignalIcon className="w-6 h-6" />
          Activity
        </h2>
        <div className="overflow-x-auto max-h-min">
          <table className="table w-full text-center">
            <thead>
              <tr>
                <th className='text-left'>Checkpoint</th>
                <th>Validator</th>
                <th>Public key</th>
                <th>Rewards</th>
                <th>Valid </th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr key={index}>
                  <td className='text-left'>
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-bold">#{activity.checkpoint}</div>
                        <div className="text-xs opacity-50 text-left">{activity.date}</div>
                        <div className="text-xs opacity-50 text-left">{activity.time}</div>
                      </div>
                    </div>
                  </td>
                  <td>{activity.validator}</td>
                  <td>{activity.publickey}</td>
                  <td>{activity.rewards} ETH</td>
                  <td>{activity.valid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

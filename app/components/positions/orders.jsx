import React from "react";

const orders = [
  {
    secondsAgo: '1',
    type: 'Long',
    strike: '82',
    expiration: '23',
    leverage: '1',
    premium: '1'
  },
  {
    secondsAgo: '1',
    type: 'Long',
    strike: '82',
    expiration: '23',
    leverage: '1',
    premium: '1'
  },
  {
    secondsAgo: '1',
    type: 'Long',
    strike: '82',
    expiration: '23',
    leverage: '1',
    premium: '1'
  },
  {
    secondsAgo: '1',
    type: 'Long',
    strike: '82',
    expiration: '23',
    leverage: '1',
    premium: '1'
  },
  {
    secondsAgo: '1',
    type: 'Long',
    strike: '82',
    expiration: '23',
    leverage: '1',
    premium: '1'
  },
]


export function Orders() {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
          Orderbook
        </h2>
        <div className="overflow-x-auto">
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                  </svg>
                </th>
                <th className="text-center">Type</th>
                <th className="text-center">Strike</th>
                <th className="text-center">Expires</th>
                <th className="text-center">Lev</th>
                <th className="text-center">Premium</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr>
                  <td>{order.secondsAgo}s ago</td>
                  <td className="text-center">{order.type}</td>
                  <td className="text-center">{order.strike} ETH</td>
                  <td className="text-center">In {order.expiration} days</td>
                  <td className="text-center">{order.leverage}x</td>
                  <td className="text-center">{order.premium} ETH</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

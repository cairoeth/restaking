export function Assets({ title, percentage, worth, APR, _yield, assets }) {
  return (
    <div className="w-84 flex flex-col justify-center">
        <div className="flex">
          {title == 'Staked assets' ? 
            <div className="isolate flex -space-x-1 overflow-hidden mt-1">
              <span className='bg-primary place-self-center h-2.5 w-2.5 flex-shrink-0 rounded-full' aria-hidden="true"/>
              <span className='bg-secondary place-self-center h-2.5 w-2.5 flex-shrink-0 rounded-full' aria-hidden="true"/>
            </div> : 
            <div className="isolate flex -space-x-1 overflow-hidden mt-1">
              <span style={{ backgroundColor: 'rgba(189, 195, 199, 1)' }} className='place-self-center h-2.5 w-2.5 flex-shrink-0 rounded-full' aria-hidden="true"/>
            </div>
          }

          <p className="ml-1.5 text-base font-semibold text-gray-600">{title} ({percentage}%)</p>
        </div>

        <p className="mt-1 flex items-baseline gap-x-2">
          <span className="text-5xl font-bold tracking-tight text-gray-900">${worth}</span>
        </p>

        <div className="mt-2 text-sm flex justify-between">
          <dl className="flex">
            <dt className="text-gray-500">APR&nbsp;</dt>
            <dd className="font-semibold text-gray-500">{APR}%&nbsp;</dd>

            {title == 'Staked assets' ? 
              <dt className="text-gray-500">| Yearly Yield&nbsp;</dt>
              : <dt className="text-gray-500">| Potential Yield&nbsp;</dt>}
            <dd className="font-bold text-primary">${_yield}</dd>
          </dl>
        </div>
        
        <div className="mt-3 relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300" />
          </div>
        </div>

        <ul role="list" className="mt-3 space-y-3 text-sm leading-6 text-gray-600">
          {assets.map((asset, assetIdx) => (
            <li key={assetIdx} className="flex gap-x-3">
              {title == 'Staked assets' ? 
              <span
                className='place-self-center h-2.5 w-2.5 flex-shrink-0 rounded-full'
                style={{ backgroundColor: asset.color }}
                aria-hidden="true"
              /> : ''}

              <div className="avatar">
                <div className="h-8 w-8 rounded-full place-self-center">
                  <img src={asset.image} />
                </div>
              </div>

              <div>
                <p className="flex items-baseline">
                  <span className="text-sm font-bold tracking-tight text-gray-900">{asset.amount} {asset.symbol}</span>
                </p>
                <p className="text-sm leading-6 text-gray-500">${asset.amountUSD} | {asset.percentage}%</p>
              </div>

            </li>
          ))}
        </ul>
    </div>
  )
}
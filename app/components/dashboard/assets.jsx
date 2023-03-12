import dynamic from "next/dynamic";

export function Assets({ title, amount, APR, textYield, assets }) {
  return (
    <div className="p-2">
    <div className="w-96 rounded-2xl bg-gray-50 ring-1 ring-inset ring-gray-900/5 flex flex-col justify-center py-8">
      <div className="px-8">
        <p className="text-base font-semibold text-gray-600">{title}</p>
        <p className="mt-2 flex items-baseline gap-x-2">
          <span className="text-5xl font-bold tracking-tight text-gray-900">{amount}</span>
        </p>

        <p className="mt-3 text-sm leading-6 text-gray-500">APR {APR} | {textYield}</p>
        
        <div className="mt-3 relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300" />
          </div>
        </div>

        <ul role="list" className="mt-6 space-y-3 text-sm leading-6 text-gray-600">
          {assets.map((asset, assetIdx) => (
            <li key="5 products" className="flex gap-x-3">
              {/* <CheckCircleIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}

              <div className="avatar">
                <div className="w-9 rounded-full">
                  <img src={asset.image} />
                </div>
              </div>

              <div>
                <p className="flex items-baseline">
                  <span className="text-sm font-bold tracking-tight text-gray-900">{asset.amount} {asset.symbol}</span>
                </p>
                <p className="text-sm leading-6 text-gray-500">{asset.amountUSD} | {asset.percentage}</p>
              </div>

            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
  )
}
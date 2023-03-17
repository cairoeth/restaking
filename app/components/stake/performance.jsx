import { ChartBarIcon } from "@heroicons/react/24/outline"
import { Staked } from "components/stake/charts/staked"

export function Performance() {
  return (
    <div className="card bg-base-100 shadow-xl mb-10 mt-6">
      <div className="card-body">
        <h2 className="card-title">
          <ChartBarIcon className="w-6 h-6" />
          Overall performance
        </h2>

        <div className="overflow-x-auto max-h-min pb-8">
          <div className="grid grid-cols-1">
            <Staked />
          </div>
        </div>
      </div>
    </div>
  )
}

import { ChartBarIcon, CurrencyDollarIcon, UsersIcon, BoltIcon } from "@heroicons/react/24/outline"
import { Staked } from "components/modules/charts/staked"
import { Users } from "components/modules/charts/users"
import { Effectiveness } from "components/modules/charts/effectiveness"
import { Chart } from "components/modules/chart"

export function Performance() {
  return (
    <div className="card bg-base-100 shadow-xl mb-10 mt-6">
      <div className="card-body">
        <h2 className="card-title">
          <ChartBarIcon className="w-6 h-6" />
          Overall performance
        </h2>

        <div className="overflow-x-auto max-h-min pb-4">
          <div className="grid grid-cols-1">
            <Chart title="Staked funds" icon={<CurrencyDollarIcon className="w-6 h-6" />} description="History of daily staked funds, which is the sum of all Effective Balances." component={<Staked />} />
            <Chart title="Users" icon={<UsersIcon className="w-6 h-6" />} description="History of daily active users." component={<Users />} />
            <Chart title="Stake Effectiveness" icon={<BoltIcon className="w-6 h-6" />} description="Stake Effectiveness measures the relation between the sum of all effective balances and the sum of all balances." component={<Effectiveness />} />
          </div>
        </div>
      </div>
    </div>
  )
}

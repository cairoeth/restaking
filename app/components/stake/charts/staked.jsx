import { Disclosure } from '@headlessui/react'
import { CurrencyDollarIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Ether',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};

export function Staked() {
  return (
    <Disclosure>
      <Disclosure.Button className="py-2">
        <div className="col-span-1 divide-y divide-gray-200 rounded-lg bg-[#fcfcfc] shadow">
          <div className="flex w-full items-center justify-between space-x-6 p-6">
            <div className="flex-1 truncate">
              <div className="flex items-center space-x-3">
                <CurrencyDollarIcon className="h-6 w-6" />
                <div class="text-lg font-bold">Staked Ether</div>
                <p className="mt-1 truncate text-sm text-gray-500">History of daily staked Ether, which is the sum of all Effective Balances.</p>
                <ChevronDownIcon
                  className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </Disclosure.Button>
      <Disclosure.Panel className="text-gray-500">
        <Bar options={options} data={data} />
      </Disclosure.Panel>
    </Disclosure>
  )
}

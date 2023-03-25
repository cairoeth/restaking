import { Square3Stack3DIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import { Popover } from '@headlessui/react'
import Image from 'next/image'
import Link from 'next/link'
import { AddModuleModal } from 'components/modules/modals/addModule'

export function Modules() {
  var modules = [
    {
      slug: 'Optimism',
      symbol: 'OP',
      blockchain: 'Ethereum Mainnet',
      image: 'https://gateway.optimism.io/static/media/optimism.caeb9392.svg',
      apy: '7.69',
      apyPerformance: '+4.79'
    },
    {
      slug: 'UMA',
      symbol: 'UMA',
      blockchain: 'Ethereum Mainnet',
      image: 'https://storage.googleapis.com/ethglobal-api-production/organizations%2Ffp1x1%2Flogo%2F1664750381528_uma.jpeg',
      apy: '15.84',
      apyPerformance: '+10.27'
    },
    {
      slug: 'UMA',
      symbol: 'UMA',
      blockchain: 'Ethereum Mainnet',
      image: 'https://storage.googleapis.com/ethglobal-api-production/organizations%2Ffp1x1%2Flogo%2F1664750381528_uma.jpeg',
      apy: '15.84',
      apyPerformance: '+10.27'
    },
  ]

  let columnAmount

  if (modules.length > 6) {
    columnAmount = 6
  } else {
    columnAmount = modules.length
  }

  const filters = [
    {
      id: 'token',
      name: 'Token',
      options: [
        { value: 'ETH', label: 'ETH' },
        { value: 'USDC-ETH UniV2', label: 'USDC-ETH UniV2' },
        { value: 'stETH', label: 'stETH' },
      ],
    },
    {
      id: 'ltv',
      name: 'LTV',
      options: [
        { value: 'Min - 100k', label: 'Min - 100k' },
        { value: '100k - 1m ', label: '100k - 1m' },
        { value: '1m - Max', label: "1m - Max" },
      ],
    },
    {
      id: 'apy',
      name: 'APY',
      options: [
        { value: 'Min - 4%', label: 'Min - 4%' },
        { value: '4% - 8%', label: '4% - 8%' },
        { value: '8% - Max', label: '8% - Max' },
      ],
    },
  ]

  return (
    <>
      <div className="card bg-base-100 shadow-xl mb-10 mt-6">
        <div className="card-body">
          <div className="card-title flex items-center justify-between mb-6">
            <div className="relative inline-block text-left">
              <div className="inline-flex mr-4">
                <h2>
                  <Square3Stack3DIcon className="inline-flex w-6 h-6 mr-1.5 mb-1" />
                  Modules
                </h2>
              </div>
              <div className="inline-flex">
                <label htmlFor="add-module-modal" className="btn btn-sm btn-primary btn-outline align-middle">
                  Add
                </label>
              </div>
            </div>

            <Popover.Group className="hidden sm:flex sm:items-baseline sm:space-x-8">
              {filters.map((section: any, sectionIdx: number) => (
                <Popover
                  as="div"
                  key={section.name}
                  id={`desktop-menu-${sectionIdx}`}
                  className="relative inline-block text-left"
                >
                  <div>
                    <Popover.Button className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                      <span>{section.name}</span>
                      {/* {sectionIdx === 0 ? (
                      <span className="ml-1.5 rounded bg-gray-200 py-0.5 px-1.5 text-xs font-semibold tabular-nums text-gray-700">
                        1
                      </span>
                    ) : null} */}
                      <ChevronDownIcon
                        className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </Popover.Button>
                  </div>

                  <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <form className="space-y-4">
                      {section.options.map((option: any, optionIdx: number) => (
                        <div key={option.value} className="flex items-center">
                          <input
                            id={`filter-${section.id}-${optionIdx}`}
                            name={`${section.id}[]`}
                            defaultValue={option.value}
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label
                            htmlFor={`filter-${section.id}-${optionIdx}`}
                            className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </form>
                  </Popover.Panel>
                </Popover>
              ))}
            </Popover.Group>
          </div>

          <div className="max-h-min pb-8">
            <div className={"grid gap-6 sm:grid-cols-" + columnAmount + " grid-cols-" + columnAmount + " lg:grid-cols-" + columnAmount}>
              {modules.map((module, moduleId) => (
                <div key={moduleId} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-[#fcfcfc] shadow">
                  <div className="flex w-full items-center justify-between space-x-6 p-6">
                    <Image className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" width={600} height={600} src={module.image} alt={module.symbol} />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-sm font-medium text-gray-900">{module.slug}</h3>
                        <span className="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                          {module.apy}%
                        </span>
                      </div>
                      <p className="mt-1 truncate text-sm text-gray-500">{module.blockchain}</p>
                    </div>
                  </div>
                  <div>
                    <div className="-mt-px flex divide-x divide-gray-200">
                      <div className="flex w-0 flex-1">
                        <Link href={'/module/' + module.slug} className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
                          {/* <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" /> */}
                          Explore
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <AddModuleModal />
    </>
  )
}

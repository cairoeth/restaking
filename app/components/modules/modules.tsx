import { Square3Stack3DIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import { Popover } from '@headlessui/react'
import Image from 'next/image'
import Link from 'next/link'
import { AddModuleModal } from 'components/modules/modals/addModule'
import { useContractRead, useContractReads, useNetwork } from 'wagmi'
import { contracts } from 'components/helpers/contracts'
import { useState, useEffect } from "react";

type Props = {
  data: any
  isError: boolean
  isLoading: boolean
}

export function Modules() {
  var moduleContracts: any = []
  var modules: any = []
  const chunkSize = 3
  const [hydrated, setHydrated] = useState(false);
  const [columnAmount, setColumnAmount] = useState(0);
  const { chain, chains } = useNetwork()

  const allModulesCall: Props = useContractRead({
    address: contracts['controller']['address'][chain?.name as keyof typeof contracts['controller']['address']] as `0x${string}`,
    abi: contracts.controller.abi,
    functionName: 'allModules',
  })

  for (var i = 0; i < allModulesCall.data?.length; ++i) {
    const moduleIndividual_name: any = {
      address: allModulesCall.data[i],
      abi: contracts.module.abi,
      functionName: 'name',
    }

    const moduleIndividual_image: any = {
      address: allModulesCall.data[i],
      abi: contracts.module.abi,
      functionName: 'image',
    }

    const moduleIndividual_tokens: any = {
      address: allModulesCall.data[i],
      abi: contracts.module.abi,
      functionName: 'getTokens',
    }

    moduleContracts.push(moduleIndividual_name, moduleIndividual_image, moduleIndividual_tokens)
  }

  const wrappersData: any = useContractReads({
    contracts: moduleContracts,
    onError(error) {
      console.log('Error', error)
    },
  })

  for (let i = 0; i < wrappersData.data?.length; i += chunkSize) {
    const chunk: any = wrappersData.data.slice(i, i + chunkSize);

    if (chunk[0] == null) {
      continue
    }

    modules.push({
      name: chunk[0],
      image: chunk[1],
      tokens: chunk[2].toString(),
      apy: '7.69',
      apyPerformance: '+4.79',
      blockchain: chain?.name,
      address: allModulesCall.data[i / 3]
    })
  }

  useEffect(() => {
    if (modules.length > 3) {
      setColumnAmount(3);
    } else {
      setColumnAmount(modules.length);
    }
  }, []);

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

  useEffect(() => {
    // This forces a rerender, so the date is rendered
    // the second time but not the first
    setHydrated(true);
  }, []);
  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }

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

          <div className="max-h-min pb-6">
            {allModulesCall.data != undefined && allModulesCall.data.length > 0 ?
              <div className={"grid gap-6 sm:grid-cols-" + columnAmount + " grid-cols-" + columnAmount + " lg:grid-cols-" + columnAmount}>
                {modules.map((module: any, moduleId: number) => (
                  <div key={moduleId} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-[#fcfcfc] shadow">
                    <div className="flex w-full items-center justify-between">
                      <div className="relative inline-block text-left">
                        <div className="inline-flex">
                          <div className="flex w-full items-center justify-between space-x-6 p-6">
                            <Image className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" width={600} height={600} src={module.image} alt={module.name} />
                            <div className="flex-1 truncate">
                              <div className="flex items-center space-x-3">
                                <h3 className="truncate text-sm font-medium text-gray-900">{module.name}</h3>
                                <span className="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                  APY {module.apy}%
                                </span>
                                <span className="justify-end place-items-end place-self-end inline-block flex-shrink-0 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                  {module.apyPerformance}%
                                </span>
                              </div>
                              <p className="mt-1 truncate text-sm text-gray-500">{(module.address.substring(0, 26)) + '...'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* <div className="flex items-baseline space-x-8">
                        <div className="relative inline-block">
                          <div className="group inline-flex items-center justify-center text-sm font-medium">
                            <div className="flex w-full items-center justify-between space-x-6 p-6">
                              <div className="flex-1 truncate">
                                <div className="flex items-center space-x-3">
                                  <h3 className="truncate text-sm font-medium text-gray-900 text-right">{(module.address.substring(0, 18)) + '...'}</h3>
                                </div>
                                <p className="mt-1 truncate text-sm text-gray-500 text-right">{"[" + module.tokens + "]"}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div> */}
                    </div>
                    <div>
                      <div className="-mt-px flex divide-x divide-gray-200">
                        <div className="flex w-0 flex-1">
                          <Link href={'/module/' + module.address} className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
                            Explore
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              :
              <div className="flex w-full items-center justify-between space-x-6 p-6">
                <div className="flex-1 truncate">
                  <div className="flex space-x-3 place-content-center">
                    <div className="text-lg">No modules added yet. Be the first one to add!&nbsp;&nbsp;👀</div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
      <AddModuleModal />
    </>
  )
}

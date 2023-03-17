import { Disclosure } from '@headlessui/react'

export function Deposits() {
  return (
    <div className="col-span-1 divide-y divide-gray-200 rounded-lg bg-[#fcfcfc] shadow">
      <div className="flex w-full items-center justify-between space-x-6 p-6">
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
    </div>
  //   <Disclosure>
  //   <Disclosure.Button className="py-2">
  //     Is team pricing available?
  //   </Disclosure.Button>
  //   <Disclosure.Panel className="text-gray-500">
  //     Yes! You can purchase a license that you can share with your entire
  //     team.
  //   </Disclosure.Panel>
  // </Disclosure>
  )
}

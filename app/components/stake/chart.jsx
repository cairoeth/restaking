import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

export function Chart({ title, icon, description, component }) {
  return (
    <Disclosure>
      <Disclosure.Button className="py-2">
        <div className="col-span-1 rounded-lg bg-[#fcfcfc] shadow">
          <div className="flex w-full items-center justify-between space-x-6 p-6">
            <div className="flex-1 truncate">
              <div className="flex items-center space-x-3">
                {icon}
                <div class="text-lg font-bold">{title}</div>
                <p className="mt-1 truncate text-sm text-gray-500">{description}</p>
                <ChevronDownIcon
                  className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
          <Disclosure.Panel className="text-gray-500">
            <div className='w-11/12 ml-12'>
              {component}
            </div>
          </Disclosure.Panel>
        </div>
      </Disclosure.Button>
    </Disclosure>
  )
}

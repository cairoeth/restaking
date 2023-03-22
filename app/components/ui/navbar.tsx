import { ConnectKitProvider, ConnectKitButton, getDefaultClient } from "connectkit";
import Link from 'next/link'
import { Menu, Popover } from '@headlessui/react'
import { ChevronDownIcon } from "@heroicons/react/24/outline"

export function Navbar() {
  return (
    <div className="navbar bg-base-100 z-10">
      <div className="navbar-start">
        <Link className="btn btn-ghost normal-case text-xl text-left" href="/">Restaking</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link href="/">Dashboard</Link></li>
          <li><Link href="/modules">Modules</Link></li>
          <li><Link href="#" target='_blank'>Docs</Link></li>
          {/* <li>
            <Popover.Group className="hidden sm:flex sm:items-baseline sm:space-x-8">
              <Popover as="div" key='More' className="relative inline-block text-left">
                <Popover.Button className="group inline-flex items-center justify-center">
                  <span>More</span>
                  <ChevronDownIcon
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </Popover.Button>

                <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Link target='_blank' href="/docs">Docs</Link>
                    </div>
                  </div>
                </Popover.Panel>
              </Popover>
            </Popover.Group>
          </li> */}

          {/*
          <li tabIndex={0}>
            <a>
              More
              <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>
            </a>
            <ul className="p-2 bg-base-100">
              <li><Link href="#">Docs</Link></li>
            </ul>
          </li> */}
        </ul>
      </div>
      <div className="navbar-end">
        <ConnectKitButton />
      </div>
    </div>
  )
}

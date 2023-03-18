import React from 'react'
import { useEffect, useState } from 'react'
import { Page } from 'components/ui/page'
import { Navbar } from 'components/ui/navbar'
import { Footer } from 'components/ui/footer'
import { Portfolio } from "components/dashboard/portfolio"
import { EnrolledStake } from "components/dashboard/enrolled"
import { DelegatedStake } from "components/dashboard/delegated"
import { useAccount } from 'wagmi'
import { ConnectKitProvider, ConnectKitButton, getDefaultClient } from "connectkit";
import Link from 'next/link'

export default function App() {
  useEffect(() => {
    document.title = "Dashboard - Restaking";
    document.documentElement.setAttribute("data-theme", "light");
    document.documentElement.className = 'bg-base-300';
  });


  const { address, connector, isConnected } = useAccount()

  if (isConnected) {
    return (
      <Page>
        <Navbar />
        <div className="px-4 py-4 sm:px-6 lg:px-40 bg-base-300 gap-y-2">
          <Portfolio />
          <EnrolledStake />
          <DelegatedStake />
        </div>
        <Footer />
      </Page>
    )
  }

  return (
    <Page>
      <Navbar />
      <div className="px-4 sm:px-6 lg:px-40 bg-base-300 gap-y-2">

        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="mx-auto max-w-2xl py-28 sm:py-44 lg:py-52">
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full py-1 px-3 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                The first public restaking framework. <Link href="#" className="font-semibold text-indigo-600"><span className="absolute inset-0" aria-hidden="true"></span>Read more <span aria-hidden="true">&rarr;</span></Link>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Restaking</h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">Where Ethereum validators and users can maximize their yield and capital value by subscribing to slashing conditions of different modules.</p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <ConnectKitButton />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Page>
  )
}

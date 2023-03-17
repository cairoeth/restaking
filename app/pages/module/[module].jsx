import { useEffect, useState, React } from 'react'
import { useRouter } from 'next/router'

import { Page } from 'components/ui/page'
import { Navbar } from 'components/ui/navbar'
import { Footer } from 'components/ui/footer'

import { Bar } from "components/module/bar";
import { Activity } from 'components/module/activity'
import { SubscribeDelegateModal } from 'components/module/actions'

// This is eventually replaced by data called from the contracts.
var data = {
  slug: 'Optimism',
  symbol: 'OP',
  blockchain: 'Ethereum Mainnet',
  image: 'https://gateway.optimism.io/static/media/optimism.caeb9392.svg',
  apr: '10.14',
  tvl: '8.33M',
  rewards7: '8.144',
  rewards14: '16.288',
  rewards31: '32.576',
  slashing: '0.44',
  validators: '69',
}

export default function App() {

  useEffect(() => {
    document.title = "Dashboard - Restaking";
    document.documentElement.setAttribute("data-theme", "light");
    document.documentElement.className = 'bg-base-300';
  });

  return (
    <Page>
      <Navbar />
      <div className="px-4 py-4 sm:px-6 lg:px-8 bg-base-300">
        <div className='w-full grid-cols-3 gap-4 overflow-y-hidden overflow-x-scroll px-10 pt-1 pb-10 xl:grid xl:overflow-x-auto xl:px-4'>
          <div className='col-span-3'>
            <Bar data={data} />
          </div>
          <div className="col-span-2">
            <Activity activities={data.activity} />
          </div>
          <div className="col-span-1 h-full">
            <SubscribeDelegateModal enrolled={false} _subscribeActive={true} />
          </div>
          {/* <div className="col-span-3">
            <Validators />
          </div> */}
        </div>
      </div>
      <Footer />
    </Page>
  );
};

import { useEffect, useState, React } from 'react'
import { Page } from 'components/ui/page'
import { Navbar } from 'components/ui/navbar'
import { ModelStats } from 'components/positions/model_stats'
import { CreateModal } from 'components/index/create'

export function Content({ factoryAddress }) {
  return (
    <div className="px-4 py-4 sm:px-6 lg:px-8 bg-base-300 mb-2">
      <ModelStats />
      <CreateModal factoryAddress={factoryAddress} />
    </div>
  )
}

export default function App() {
  let factoryAddress = '0x96F4c2b61F23324A3C29DDF47b898F02eaCA3839';

  useEffect(() => {
    document.title = "Dashboard - Restaking";
    document.documentElement.setAttribute("data-theme", "black");
    document.documentElement.className = 'bg-base-300';
  });

  return (
    <Page>
      <Navbar />
      <Content factoryAddress={factoryAddress} />
    </Page>
  );
};

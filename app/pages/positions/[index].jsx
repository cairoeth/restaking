import { useEffect, React, useState } from 'react'
import { Page } from 'components/ui/page'
import { Navbar } from 'components/ui/navbar'
import { Form } from "components/positions/form";
import { Positions } from "components/positions/positions";
import { Bar } from "components/positions/bar";
import { Orders } from "components/positions/orders";
import { Bids } from "components/positions/bids";
import { Chart } from "components/positions/chart";
import dynamic from "next/dynamic";
import { useRouter } from 'next/router'

export function Content({ indexAddress, index }) {
  return (
    <>
      <div className="px-4 py-4 sm:px-6 lg:px-8 bg-base-300">
        <div className='w-full grid-cols-3 gap-4 overflow-y-hidden overflow-x-scroll px-10 pt-1 pb-10 xl:grid xl:overflow-x-auto xl:px-4 svelte-1n6ue57'>
          <div className='col-span-3'>
            <Bar index={ index }/>
          </div>
          <div className="col-span-2">
            <Chart />
          </div>
          <div className="col-span-1 h-full">
            <Form indexAddress={indexAddress} index={ index } />
          </div>
          <div className="col-span-2">
            <Positions />
          </div>
        </div>
      </div>
      <Bids />
    </>
  )
}

export default function App() {
  const router = useRouter()
  const { index } = router.query


  const [indexAddress, setIndexAddress] = useState("");

  useEffect(() => {
    document.title = "Indices";
    document.documentElement.setAttribute("data-theme", "black");
    document.documentElement.className = 'bg-base-300';
  });

  return (
    <Page>
      <Navbar />
      <Content indexAddress={indexAddress} index={ index } />
    </Page>
  );
};


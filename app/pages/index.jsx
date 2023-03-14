import { useEffect, useState, React } from 'react'
import { Page } from 'components/ui/page'
import { Navbar } from 'components/ui/navbar'
import { Footer } from 'components/ui/footer'
import { Portfolio } from "components/dashboard/portfolio"
import { EnrolledStake } from "components/dashboard/enrolled"
import { DelegatedStake } from "components/dashboard/delegated"


export default function App() {
  useEffect(() => {
    document.title = "Dashboard - Restaking";
    document.documentElement.setAttribute("data-theme", "light");
    document.documentElement.className = 'bg-base-300';
  });

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
  );
};

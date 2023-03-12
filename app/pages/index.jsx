import { useEffect, useState, React } from 'react'
import { Page } from 'components/ui/page'
import { Navbar } from 'components/ui/navbar'
import { Footer } from 'components/ui/footer'
import { Assets } from "components/dashboard/assets";
import { Stake } from "components/dashboard/stake";
import { Chart as ChartJS, ArcElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement);

const stakedAssets = [
  {
    symbol: 'ETH',
    address: '0x000000000',
    image: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0000000000085d4780B73119b644AE5ecd22b376/logo.png',
    amount: '17.36',
    amountUSD: '$25,500',
    percentage: '60.2%',
  },
]

export const pieData = {
  labels: ['Blue'],
  datasets: [
    {
      data: [100],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderWidth: 0,
    },
  ],
};

export const pieOptions = {
  cutout: '90%',
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: false
    },
  },
};

export const piePlugins = [{
  beforeDraw: function(chart) {
    var width = chart.width,
    height = chart.height,
    ctx = chart.ctx;
    ctx.restore();

    var text1 = "Total assets"
    var text2 = "$97,242"
    var text3 = "APR 4.02%"
    var textY = height / 1.75;
    ctx.textAlign = 'left';

    ///////////// TEXT 1 /////////////
    ctx.font = "1rem Segoe UI";
    ctx.fillText(text1, Math.round((width - ctx.measureText(text1).width) / 2), textY - 55);

    ///////////// TEXT 2 /////////////
    ctx.font = "bold 3rem Segoe UI";
    ctx.fillText(text2, Math.round((width - ctx.measureText(text2).width) / 2), textY - 3);

    ///////////// TEXT 3 /////////////
    ctx.font = "1rem Segoe UI";
    ctx.fillText(text3, Math.round((width - ctx.measureText(text3).width) / 2), textY + 30);

    ctx.save();
  } 
}]

export function Content({ factoryAddress }) {
  return (
    <div className="px-4 py-4 sm:px-6 lg:px-8 bg-base-300 mb-2">
      {/* PORTFOLIO SUMMARY */}
      <div className="ml-20 w-11/12">

        <div className="navbar">
          <div className="navbar-start">
            <p className="mt-2 flex items-baseline gap-x-2">
              <span className="text-3xl font-bold tracking-tight text-black">My portfolio</span>
            </p>
          </div>

          <div className="navbar-center hidden lg:flex"></div>

          <div className="navbar-end">
            test
          </div>
        </div>

        <div className="contents">
          <div className="rounded-3xl bg-white mx-auto w-full">
            <div className="ring-1 ring-gray-200 lg:mx-0 lg:flex lg:max-w-none">
              
              <div class="py-8 mx-auto max-h-96">
                <Doughnut options={pieOptions} data={pieData} plugins={piePlugins} />
              </div>

              <Assets title='Staked Assets (60.2%)' amount='$58,656' APR='6.67%' textYield='Yearly Yield $3,918' assets={stakedAssets} />

              <Assets title='Available to stake (38.8%)' amount='$16,520' APR='7.05%' textYield='Potential Yield $2,911' assets={stakedAssets} />
            </div>
          </div>
        </div>
        
      </div>

      {/* STAKED ASSETS - ENROLLED */}
      <Stake title='Stake enrolled' />

      {/* STAKED ASSETS - DELEGATED */}
      <Stake title='Stake delegated' />
    </div>
  )
}

export default function App() {
  let factoryAddress = '0x96F4c2b61F23324A3C29DDF47b898F02eaCA3839';

  useEffect(() => {
    document.title = "Dashboard - Restaking";
    document.documentElement.setAttribute("data-theme", "light");
    document.documentElement.className = 'bg-base-300';
  });

  return (
    <Page>
      <Navbar />
      <Content factoryAddress={factoryAddress} />
      <Footer />
    </Page>
  );
};

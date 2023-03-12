import { useEffect, useState, React } from 'react'
import { Page } from 'components/ui/page'
import { Navbar } from 'components/ui/navbar'
import { CheckIcon, CheckCircleIcon } from '@heroicons/react/20/solid'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, plugins } from 'chart.js';
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
    ctx.font = (height / 640).toFixed(2) + "em sans-serif";
    ctx.fillText(text1, Math.round((width - ctx.measureText(text1).width) / 2), textY);

    ///////////// TEXT 2 /////////////
    ctx.font = (height / 320).toFixed(2) + "em sans-serif";
    ctx.fillText(text2, Math.round((width - ctx.measureText(text2).width) / 2), textY - 50);

    ///////////// TEXT 3 /////////////
    ctx.font = (height / 640).toFixed(2) + "em sans-serif";
    ctx.fillText(text3, Math.round((width - ctx.measureText(text3).width) / 2), textY - 100);

    ctx.save();
  } 
}]

export function Content({ factoryAddress }) {
  return (
    <div className="px-4 py-4 sm:px-6 lg:px-8 bg-base-300 mb-2">
      <div className="hero my-5 w-full">

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

        <div className="hero-content contents">
          <div>
            <div className="bg-white">
              <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-2xl rounded-3xl ring-1 ring-gray-200 lg:mx-0 lg:flex lg:max-w-none">
                  <div className="p-8 sm:p-10 lg:flex-auto">
                    <p className="mt-6 text-base leading-7 text-gray-600">
                      Lorem ipsum dolor sit amet consect etur adipisicing elit. Itaque amet indis perferendis blanditiis
                      repellendus etur quidem assumenda.
                    </p>
                    <Doughnut options={pieOptions} data={pieData} plugins={piePlugins} />
                  </div>

                  <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                    <div className="rounded-2xl bg-gray-50 py-10 ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                      <div className="mx-auto max-w-xs px-8">
                        <p className="text-base font-semibold text-gray-600">Staked assets (60.2%)</p>
                        <p className="mt-2 flex items-baseline justify-center gap-x-2">
                          <span className="text-5xl font-bold tracking-tight text-gray-900">$58,656</span>
                        </p>

                        <p className="mt-3 text-sm leading-6 text-gray-500">APR 6.67 | Yearly Yield $3,918</p>
                        
                        <div className="mt-3 relative">
                          <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-gray-300" />
                          </div>
                        </div>

                        <ul role="list" className="mt-6 space-y-3 text-sm leading-6 text-gray-600">
                          {stakedAssets.map((asset, assetIdx) => (
                            <li key="5 products" className="flex gap-x-3">
                              {/* <CheckCircleIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}

                              <div className="avatar">
                                <div className="w-8 rounded-full">
                                  <img src={asset.image} />
                                </div>
                              </div>

                              <div>
                                <p className="flex items-baseline">
                                  <span className="text-sm font-bold tracking-tight text-gray-900">{asset.amount} {asset.symbol}</span>
                                </p>
                                <p className="text-sm leading-6 text-gray-500">{asset.amountUSD} | {asset.percentage}</p>
                              </div>

                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
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
    </Page>
  );
};

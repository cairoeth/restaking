import { Assets } from "components/dashboard/assets"
import { Chart as ChartJS, ArcElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline"

ChartJS.register(ArcElement);

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
        ctx.font = (height / 300).toFixed(2) + "rem Segoe UI";
        ctx.fillText(text1, Math.round((width - ctx.measureText(text1).width) / 2), textY - (0.4 * textY));

        ///////////// TEXT 2 /////////////
        ctx.font = "bold " + (height / 100).toFixed(2) + "rem Segoe UI";
        ctx.fillText(text2, Math.round((width - ctx.measureText(text2).width) / 2), textY - 3);

        ///////////// TEXT 3 /////////////
        ctx.font = (height / 300).toFixed(2) + "rem Segoe UI";
        ctx.fillText(text3, Math.round((width - ctx.measureText(text3).width) / 2), textY + (0.25 * textY));

        ctx.save();
    } 
}]

const stakedAssets = [
    {
      symbol: 'ETH',
      address: '0x000000000',
      image: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0000000000085d4780B73119b644AE5ecd22b376/logo.png',
      amount: '17.36',
      amountUSD: '$25,500',
      percentage: '60.2%',
    },
    {
        symbol: 'ETH',
        address: '0x000000000',
        image: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0000000000085d4780B73119b644AE5ecd22b376/logo.png',
        amount: '17.36',
        amountUSD: '$25,500',
        percentage: '60.2%',
      },
      {
        symbol: 'ETH',
        address: '0x000000000',
        image: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0000000000085d4780B73119b644AE5ecd22b376/logo.png',
        amount: '17.36',
        amountUSD: '$25,500',
        percentage: '60.2%',
      },
  ]

export function Portfolio() {
    return (
        <div className="card bg-base-100 shadow-xl mb-10 mt-6">
            <div className="card-body">
                <h2 className="card-title">
                    <ClipboardDocumentCheckIcon className="w-6 h-6" />
                    Portfolio
                </h2>
                <div className="overflow-x-auto max-h-min pb-8">
                    <div class="grid grid-cols-4 gap-4">
                        <div class="col-span-2 max-h-[90%] place-self-center">
                            <Doughnut options={pieOptions} data={pieData} plugins={piePlugins} />
                        </div>
                        <div>
                            <Assets title='Staked Assets (60.2%)' amount='$58,656' APR='6.67%' textYield='Yearly Yield $3,918' assets={stakedAssets} />
                        </div>
                        <div>
                            <Assets title='Available to stake (38.8%)' amount='$16,520' APR='7.05%' textYield='Potential Yield $2,911' assets={stakedAssets} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
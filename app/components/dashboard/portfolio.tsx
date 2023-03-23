import { Assets } from "components/dashboard/assets"
import { Chart as ChartJS, ArcElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline"
import { useContractReads, useBalance, useAccount } from 'wagmi'
import { tokens } from 'components/helpers/contracts'
import { usePrice } from 'components/helpers/prices'
import { BigNumber, ethers } from "ethers";
import { StakedAssetsSimulator } from 'components/helpers/simulators'

ChartJS.register(ArcElement);

const pieOptions = {
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

function useAvailableAssets(address: any) {
  var availableAssets: any = []
  var totalUSD = 0
  var APR = 7.7

  for (var i = 0; i < tokens.length; ++i) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, isError, isLoading } = useBalance({
      address: address,
      token: tokens[i].address as any,
    })

    const amountUSD: any = data?.formatted as any * tokens[i].price

    availableAssets.push({
      symbol: tokens[i].symbol,
      address: tokens[i].address,
      image: tokens[i].image,
      amount: data?.formatted,
      amountUSD: amountUSD.toFixed(2),
    })

    totalUSD += amountUSD
  }

  return {
    assets: availableAssets,
    worth: String(totalUSD.toFixed(2)),
    APR: String(APR),
    yield: String(((APR / 100) * totalUSD).toFixed(2)),
  }
}

function useStakedAssets(address: any) {
  var stakedAssets: any = []
  var totalUSD = 0
  var APR = 8.7

  const data: any = StakedAssetsSimulator()

  for (var i = 0; i < tokens.length; ++i) {
    const amountUSD: any = data[tokens[i].address] as any * tokens[i].price

    stakedAssets.push({
      symbol: tokens[i].symbol,
      address: tokens[i].address,
      image: tokens[i].image,
      amount: data[tokens[i].address],
      amountUSD: amountUSD.toFixed(2),
      color: tokens[i].color,
    })

    totalUSD += amountUSD
  }

  return {
    assets: stakedAssets,
    worth: String(totalUSD.toFixed(2)),
    APR: String(APR),
    yield: String(((APR / 100) * totalUSD).toFixed(2)),
  }
}

export function Portfolio() {
  var pieValues = []
  var pieColors = []

  const { address, isConnecting, isDisconnected } = useAccount()

  const availableAssets: any = useAvailableAssets(address)
  const stakedAssets: any = useStakedAssets(address)

  const totalWorth: any = (parseFloat(availableAssets.worth) + parseFloat(stakedAssets.worth)).toFixed(2)
  const availablePercentrage: any = ((parseFloat(availableAssets.worth) / totalWorth) * 100).toFixed(2)
  const stakedPercentage: any = ((parseFloat(stakedAssets.worth) / totalWorth) * 100).toFixed(2)

  for (var i = 0; i < stakedAssets.assets.length; ++i) {
    // Calculate the token percentage of the total worth
    const assetPercentage: any = ((parseFloat(stakedAssets.assets[i].amountUSD) / totalWorth) * 100).toFixed(2)

    // Add the token percentage to the doughnut chart
    pieValues.push(assetPercentage)

    // Add the token color to the doughnut chart
    pieColors.push(stakedAssets.assets[i].color)

    // Assign the percentage to the asset.
    stakedAssets.assets[i].percentage = assetPercentage
  }

  for (var i = 0; i < availableAssets.assets.length; ++i) {
    // Calculate the token percentage of the total worth
    const assetPercentage: any = ((parseFloat(availableAssets.assets[i].amountUSD) / totalWorth) * 100).toFixed(2)

    // Assign the percentage to the asset.
    availableAssets.assets[i].percentage = assetPercentage
  }

  // Add unstaked percentage
  pieValues.push(availablePercentrage.toString())
  // Add unstaked color
  pieColors.push('rgba(189, 195, 199, 1)')

  const pieData = {
    datasets: [
      {
        data: pieValues,
        backgroundColor: pieColors,
        borderWidth: 0,
      },
    ],
  };

  const piePlugins = [{
    id: 'textinside',
    beforeDraw: function (chart: any) {
      var width = chart.width,
        height = chart.height,
        ctx = chart.ctx;
      ctx.restore();

      var text1 = "Total assets"
      var text2 = "$" + totalWorth
      console.log(totalWorth)
      console.log(text2)
      var text3 = "APR " + ((parseFloat(availableAssets.APR) + parseFloat(stakedAssets.APR)) / 2).toString() + "%"
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

  return (
    <div className="card bg-base-100 shadow-xl mb-10 mt-6">
      <div className="card-body">
        <h2 className="card-title">
          <ClipboardDocumentCheckIcon className="w-6 h-6" />
          Portfolio
        </h2>
        <div className="overflow-x-auto max-h-min pb-8">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2 max-h-[90%] place-self-center">
              <Doughnut options={pieOptions} data={pieData} plugins={piePlugins} />
            </div>
            <div>
              <Assets title='Staked assets' percentage={stakedPercentage} worth={stakedAssets.worth} APR={stakedAssets.APR} _yield={stakedAssets.yield} assets={stakedAssets.assets} />
            </div>
            <div>
              <Assets title='Available to stake' percentage={availablePercentrage} worth={availableAssets.worth} APR={availableAssets.APR} _yield={availableAssets.yield} assets={availableAssets.assets} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

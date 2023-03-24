import { Assets } from "components/dashboard/assets"
import { Chart as ChartJS, ArcElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline"
import { useContractRead, useContractReads, useBalance, useAccount, erc20ABI } from 'wagmi'
import { tokens, contracts } from 'components/helpers/contracts'
import { usePrice } from 'components/helpers/prices'
import { BigNumber, ethers } from "ethers";
import { StakedAssetsSimulator } from 'components/helpers/simulators'

type Props = {
  data: any
  isError: boolean
  isLoading: boolean
}

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

function useAvailableAssets(wrappers: any, address: any) {
  var availableAssets: any = []
  var totalUSD = 0
  var APR = 7.7

  if (wrappers == undefined) {
    return { assets: [], worth: 0, APR: 0, yield: 0 }
  }

  for (var i = 0; i < wrappers.length; ++i) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const wrapperCall: Props = useContractRead({
      address: wrappers[i],
      abi: contracts.wrapper.abi,
      functionName: 'wrapped',
    })

    const underlyingContract: any = {
      address: wrapperCall.data,
      abi: erc20ABI,
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const underlyingData: any = useContractReads({
      contracts: [
        {
          ...underlyingContract,
          functionName: 'symbol',
        },
        {
          ...underlyingContract,
          functionName: 'balanceOf',
          args: [address],
        },
        {
          ...underlyingContract,
          functionName: 'decimals',
        },
      ],
      onError(error) {
        console.log('Error', error)
      },
    })

    if (underlyingData.data == undefined) {
      return { assets: [], worth: 0, APR: 0, yield: 0 }
    }

    const balance: any = ethers.utils.formatUnits(underlyingData.data[1], underlyingData.data[2])
    if (balance > 0) {
      const amountUSD: any = balance * 1

      availableAssets.push({
        symbol: underlyingData.data[0],
        address: tokens[i].address,
        image: "https://generative-placeholders.glitch.me/image?width=600&height=300&img=" + underlyingData.data[0],
        amount: balance,
        amountUSD: amountUSD.toFixed(2),
      })

      totalUSD += amountUSD
    } else {
      continue
    }
  }

  return {
    assets: availableAssets,
    worth: String(totalUSD.toFixed(2)),
    APR: String(APR),
    yield: String(((APR / 100) * totalUSD).toFixed(2)),
  }
}

function useStakedAssets(wrappers: any, address: any) {
  var stakedAssets: any = []
  var totalUSD = 0
  var APR = 8.7

  if (wrappers == undefined) {
    return { assets: [], worth: 0, APR: 0, yield: 0 }
  }

  for (var i = 0; i < wrappers.length; ++i) {
    const wrapperContract: any = {
      address: wrappers[i],
      abi: contracts.wrapper.abi,
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const wrapperData: any = useContractReads({
      contracts: [
        {
          ...wrapperContract,
          functionName: 'symbol',
        },
        {
          ...wrapperContract,
          functionName: 'balanceOf',
          args: [address],
        },
        {
          ...wrapperContract,
          functionName: 'decimals',
        },
      ],
      onError(error) {
        console.log('Error', error)
      },
    })

    if (wrapperData.data == undefined) {
      return { assets: [], worth: 0, APR: 0, yield: 0 }
    }

    const balance: any = ethers.utils.formatUnits(wrapperData.data[1], wrapperData.data[2])
    if (balance > 0) {
      const amountUSD: any = balance * 1

      stakedAssets.push({
        symbol: wrapperData.data[0],
        address: wrappers[i],
        image: "https://generative-placeholders.glitch.me/image?width=600&height=300&img=" + wrapperData.data[0],
        amount: balance,
        amountUSD: amountUSD.toFixed(2),
        color: 'xxx'
      })

      totalUSD += amountUSD
    } else {
      continue
    }
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

  const allWrappersCall: Props = useContractRead({
    address: contracts.controller.address as `0x${string}`,
    abi: contracts.controller.abi,
    functionName: 'allWrappers',
  })

  const availableAssets: any = useAvailableAssets(allWrappersCall.data, address)
  const stakedAssets: any = useStakedAssets(allWrappersCall.data, address)

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

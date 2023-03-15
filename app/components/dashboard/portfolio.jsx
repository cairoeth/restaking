import { Assets } from "components/dashboard/assets"
import { Chart as ChartJS, ArcElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline"

ChartJS.register(ArcElement);

function stringToColour(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

function hexToRgbA(hex){
  var c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
      c= hex.substring(1).split('');
      if(c.length== 3){
          c= [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c= '0x'+c.join('');
      return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
  }
  throw new Error('Bad Hex');
}

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

export function Portfolio() {
  var stakedAssets = [
    {
      symbol: 'ANKR',
      address: '0x8290333ceF9e6D528dD5618Fb97a76f268f3EDD4',
      image: '',
      amount: '818,094.32',
      amountUSD: '25,500',
      percentage: '26.2',
      color: '',
    },
    {
      symbol: 'ETH',
      address: '0x0000000000000000000000000000000000000000',
      image: '',
      amount: '9.7188',
      amountUSD: '13,455',
      percentage: '13.8',
      color: '',
    },
    {
      symbol: 'MATIC',
      address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
      image: '',
      amount: '14,358.1244',
      amountUSD: '11,200',
      percentage: '11.5',
      color: '',
    },
    {
      symbol: 'BNB',
      address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
      image: '',
      amount: '29.9998',
      amountUSD: '8,500',
      percentage: '8.7',
      color: '',
    },
  ]

  var pieValues = []
  var pieColors = []
  var pieUnstaked = 100

  for (var i = 0; i < stakedAssets.length; ++i) {
    // Calculate the color of the given token
    var color = hexToRgbA(stringToColour(stakedAssets[i].address))
    console.log(color)
    // Assign color to the token legend
    stakedAssets[i].color = color

    // Add the token percentage to the doughnut chart
    pieValues.push(stakedAssets[i].percentage)
    // Add the token color to the doughnut chart
    pieColors.push(color)
    // Subtract the token percentage from the total unstaked percentage
    pieUnstaked -= parseFloat(stakedAssets[i].percentage)

    // Add token image
    if (stakedAssets[i].address == '0x0000000000000000000000000000000000000000') {
      stakedAssets[i].image = 'https://etherscan.io/images/main/empty-token.png'
    } else {
      stakedAssets[i].image = "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/" + stakedAssets[i].address + "/logo.png"
    }
  }

  // Add unstaked percentage
  pieValues.push(pieUnstaked.toString())
  // Add unstaked color
  pieColors.push('rgba(189, 195, 199, 1)')

  var pieData = {
    datasets: [
      {
        data: pieValues,
        backgroundColor: pieColors,
        borderWidth: 0,
      },
    ],
  };

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
                          <Assets title='Staked assets' percentage='60.2' amount='$58,656' APR='6.67%' textYield='Yearly Yield $3,918' assets={stakedAssets} />
                      </div>
                      <div>
                          <Assets title='Available to stake' percentage='38.8' amount='$16,520' APR='7.05%' textYield='Potential Yield $2,911' assets={stakedAssets} />
                      </div>
                  </div>
              </div>
          </div>
      </div>
  )
}
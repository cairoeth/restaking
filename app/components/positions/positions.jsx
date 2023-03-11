import { useEffect, useState, React } from 'react'
import { usePrepareContractWrite, useContractWrite, useContractRead, useContractReads } from 'wagmi'
import { utils, BigNumber } from 'ethers'

const calc = (exchangeAddress) => {
  const { data, isSuccess } = useContractRead({
    address: exchangeAddress,
    abi: [{
      "inputs": [
        {
          "internalType": "address",
          "name": "_address",
          "type": "address"
        }
      ],
      "name": "getOptions",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }],
    functionName: 'getOptions',
    args: ["0xe3d8E58551d240626D50EE26FAFF2649e1EEE3cb"],
  });

  let contracts = [];

  if (isSuccess) {
    for (let i = 0; i < data.length; i++) {
      const point = {
        address: exchangeAddress,
        abi: [{
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_id",
              "type": "uint256"
            }
          ],
          "name": "getOption",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "_id",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "_index",
                  "type": "address"
                },
                {
                  "internalType": "bool",
                  "name": "_type",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "_strike",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "_premium",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "_expiry",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "_denomination",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "_timestamp",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "_buyer",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "_seller",
                  "type": "address"
                }
              ],
              "internalType": "struct Exchange.OptionInfo",
              "name": "",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }],
        functionName: 'getOption',
        args: [data[i].toNumber()],
      }
      contracts.push(point)
    }
  }

  const read = useContractReads({
    contracts: contracts
  })

  return read;
}


export function ActivePositions({ positions, exchangeAddress }) {
  const { config } = usePrepareContractWrite({
    address: exchangeAddress,
    abi: [
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          }
        ],
        "name": "acceptOption",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
    ],
    functionName: 'acceptOption',
    args: [0],
  })

  const { data, write } = useContractWrite(config);

  console.log(positions[0]);
  console.log(positions[1]);

  return (
    <div className="overflow-x-auto max-h-min">
      <table className="table table-compact w-full">
        <thead>
          <tr>
            <th>Id</th>
            <th>Type</th>
            <th>Strike</th>
            <th>Expiration</th>
            <th >Leverage</th>
            <th>Premium</th>
            <th><span></span></th>
            <th><span></span></th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position, index) => (
            <tr>
              <td>{position._id.toNumber()}</td>
              <td >{position._type ? 'Put' : 'Call'}</td>
              <td >{ utils.formatEther(position._strike.toString()) } ETH</td>
              <td >{ position._expiry.toNumber() - Math.floor(Date.now() / 1000) <= 0 ? 'Expired' : ('In ' + position._expiry.toNumber() - Math.floor(Date.now() / 1000) + "s")} </td>
              <td>1x</td>
              <td>{ position._timestamp.toNumber() == 0 ? 'Pending' : utils.formatEther(position._premium.toString())}</td>
              <td>
                {position._timestamp.toNumber() != 0 ?
                  <div>
                    <button className="btn btn-xs btn-outline">
                      Close
                    </button>
                  </div> :
                  <div>
                    <btn className="btn btn-xs btn-warning">
                      Cancel
                    </btn>
                  </div>}
              </td>
              <td>
                {position._timestamp.toNumber() != 0 ?
                  '' :

                  <div>
                    <btn className="btn btn-xs btn-success" onClick={() => write?.()}>
                      Accept
                    </btn>
                  </div>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function NoActivePositions() {
  return (
    <div
      className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
      <svg xmlns="//www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-auto h-9 w-9 text-gray-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
      </svg>
      <span className="mt-5 block text-sm font-medium">You haven't taken any positions.</span>
    </div>
  )
}

export function Positions() {
  let exchangeAddress = '0xcbB45f7A705238dC7BbC1eae5fD238FF2507cE9B';

  let positions = []

  const data = calc(exchangeAddress);
  if (data["isSuccess"]) {
    positions = data["data"];
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
          </svg>
          All Positions
        </h2>
        {positions.length > 0 ? <ActivePositions positions={positions} exchangeAddress={exchangeAddress} /> : <NoActivePositions />}
      </div>
    </div>
  )
}
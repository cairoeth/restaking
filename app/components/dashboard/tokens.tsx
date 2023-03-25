import { PuzzlePieceIcon } from "@heroicons/react/24/outline"
import Image from 'next/image'
import { ColumnWrappers } from "components/dashboard/column"
import Link from 'next/link'
import { CreateWrapperModal } from 'components/dashboard/modals/createWrapper'
import { useContractRead, useContractReads, useAccount, useNetwork } from 'wagmi'
import { contracts } from 'components/helpers/contracts'

type Props = {
  data: any
  isError: boolean
  isLoading: boolean
}

export function CreateWrapper(wrapperAddress: any) {
  const { address, isConnecting, isDisconnected } = useAccount()

  const wrapperContract: any = {
    address: wrapperAddress.wrapperAddress,
    abi: contracts.wrapper.abi,
  }

  const wrapperData: any = useContractReads({
    contracts: [
      {
        ...wrapperContract,
        functionName: 'name',
      },
      {
        ...wrapperContract,
        functionName: 'symbol',
      },
      {
        ...wrapperContract,
        functionName: 'wrapped',
      },
      {
        ...wrapperContract,
        functionName: 'totalSupply',
      },
      {
        ...wrapperContract,
        functionName: 'balanceOf',
        args: [address],
      },
    ],
    onError(error) {
      console.log('Error', error)
    },
  })

  if (wrapperData.data != undefined && wrapperData.data[0] != null) {
    const name = wrapperData.data[0]
    const symbol = wrapperData.data[1]
    const image = "https://generative-placeholders.glitch.me/image?width=600&height=300&img=" + name
    const addressWrapper = wrapperAddress.wrapperAddress
    const underlying = wrapperData.data[2]
    const totalSupply = wrapperData.data[3]
    const yourBalance = wrapperData.data[4]

    return (
      <>
        <td className='text-left'>
          <Link href={'https://goerli.etherscan.io/address/' + addressWrapper}>
            <div className="flex items-center space-x-3">
              <div className="avatar">
                <div className="mask mask-squircle w-12 h-12 rounded-full">
                  <Image width={600} height={600} src={image} alt={"Image of wrapper " + name} />
                </div>
              </div>
              <div>
                <div className="text-lg font-bold">{name}</div>
                <div className="text-base text-left text-gray-500">{symbol}</div>
              </div>
            </div>
          </Link>
        </td>
        <ColumnWrappers first="Address" second={(addressWrapper.substring(0, 18)) + '...'} third={''} link={'https://goerli.etherscan.io/address/' + addressWrapper} />
        <ColumnWrappers first="Underlying" second={(underlying.substring(0, 18)) + '...'} third={''} link={'https://goerli.etherscan.io/address/' + underlying} />
        <ColumnWrappers first="Total Supply" second={totalSupply + ' ' + symbol} third={''} link={'#'} />
        <ColumnWrappers first="Your balance" second={yourBalance + ' ' + symbol} third={''} link={'#'} />
        <td>
          <div className="flex-none">
            <Link className="btn btn-sm btn-secondary btn-outline ml-4 align-middle" href='/modules'>
              Filter modules
            </Link>
          </div>
        </td>
      </>
    )
  }
  return null
}

export function AllTokens() {
  const { chain, chains } = useNetwork()

  const allWrappersCall: Props = useContractRead({
    address: contracts['controller']['address'][chain?.name as keyof typeof contracts['controller']['address']] as `0x${string}`,
    abi: contracts.controller.abi,
    functionName: 'allWrappers',
  })

  return (
    <>
      <div className="card bg-base-100 shadow-xl mb-10">
        <div className="card-body">
          <div className="card-title flex items-center justify-between mb-6">
            <div className="relative inline-block text-left">
              <div className="inline-flex mr-4">
                <h2>
                  <PuzzlePieceIcon className="inline-flex w-6 h-6 mr-1.5 mb-1" />
                  All wrappers
                </h2>
              </div>
            </div>

            <div className="hidden sm:flex sm:items-baseline sm:space-x-8">
              <div className="relative inline-block text-left">
                <div className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  <label htmlFor="create-wrapper-modal" className="btn btn-sm btn-primary btn-outline ml-4 align-middle">
                    Create Wrapper
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto max-h-min">
            {allWrappersCall.data != undefined && allWrappersCall.data.length > 0 ?
              <table className="table w-full text-center">
                <tbody>
                  {allWrappersCall.data.map((wrapperAddress: any, index: number) => (
                    <tr key={index}>
                      <CreateWrapper wrapperAddress={wrapperAddress} />
                    </tr>
                  ))}
                </tbody>
              </table>
              :
              <div className="flex w-full items-center justify-between space-x-6 p-6">
                <div className="flex-1 truncate">
                  <div className="flex space-x-3 place-content-center">
                    <div className="text-lg">No wrappers created yet. Be the first one to create!&nbsp;&nbsp;👀</div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
      <CreateWrapperModal />
    </>
  )
}

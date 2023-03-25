import * as React from 'react'
import { PlusCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import useDebounce from 'components/helpers/useDebounce'
import { contracts } from 'components/helpers/contracts'
import { Popover } from '@headlessui/react'

export function AddModuleModal() {
  const [address, setAddress] = React.useState('')
  const debouncedAddress = useDebounce(address)

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: contracts.controller.address as `0x${string}`,
    abi: contracts.controller.abi,
    functionName: 'addModule',
    args: [debouncedAddress],
    enabled: Boolean(debouncedAddress),
  })
  const { data, error, isError, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  if (isSuccess) {
    window.location.reload();
  }

  return (
    <>
      <input type="checkbox" id="add-module-modal" className="modal-toggle" />
      <label htmlFor="add-module-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">Add a module</h3>
          <p className="py-4">Add a module to the restaking platform. Contract must follow minimum interface.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              write?.()
            }}
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Contract module address</span>
              </label>
              <label className="input-group">
                <input
                  id="address"
                  type="text"
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="0x0"
                  className="input input-bordered w-full"
                  value={address}
                  required
                />
              </label>
            </div>

            <button disabled={!write || isLoading} className="mt-6 btn btn-block space-x-2">
              <div className="inline-flex items-center">
                {isLoading ? 'Adding...' :
                  <>
                    <PlusCircleIcon className="w-6 h-6 mr-2" />
                    Add
                  </>
                }
              </div>
            </button>

            {isSuccess && (
              <div>
                Successfully added module!
                <div>
                  <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
                </div>
              </div>
            )}
            {(isPrepareError || isError) && (
              <div>Error: {(prepareError || error)?.message}</div>
            )}
          </form>
        </label>
      </label>
    </>
  )
}

import { useEffect, useState, React } from 'react'
import { Page } from 'components/ui/page'
import { Navbar } from 'components/ui/navbar'
import { ModelStats } from 'components/positions/model_stats'
import { CreateModal } from 'components/index/create'
import { CheckIcon, CheckCircleIcon } from '@heroicons/react/20/solid'

const includedFeatures = [
  'Private forum access',
  'Member resources',
  'Entry to annual conference',
  'Official member t-shirt',
]

const tiers = [
  {
    name: 'Basic',
    id: 'tier-basic',
    href: '#',
    price: { monthly: '$15', annually: '$12' },
    description: 'Everything necessary to get started.',
    features: ['5 products', 'Up to 1,000 subscribers', 'Basic analytics', '48-hour support response time'],
  },
  {
    name: 'Essential',
    id: 'tier-essential',
    href: '#',
    price: { monthly: '$30', annually: '$24' },
    description: 'Everything in Basic, plus essential tools for growing your business.',
    features: [
      '25 products',
      'Up to 10,000 subscribers',
      'Advanced analytics',
      '24-hour support response time',
      'Marketing automations',
    ],
  },
  {
    name: 'Growth',
    id: 'tier-growth',
    href: '#',
    price: { monthly: '$60', annually: '$48' },
    description: 'Everything in Essential, plus collaboration tools and deeper insights.',
    features: [
      'Unlimited products',
      'Unlimited subscribers',
      'Advanced analytics',
      '1-hour, dedicated support response time',
      'Marketing automations',
      'Custom reporting tools',
    ],
  },
]

export function Content({ factoryAddress }) {
  return (
    <div className="px-4 py-4 sm:px-6 lg:px-8 bg-base-300 mb-2">
      <div className="hero my-5">
        <div className="hero-content contents">
          <div>
            <div className="stats shadow">
              <div className="bg-white">
                <div className="mx-auto max-w-7xl">
                  <div className="mx-auto max-w-2xl rounded-3xl ring-1 ring-gray-200 lg:mx-0 lg:flex lg:max-w-none">
                    <div className="p-8 sm:p-10 lg:flex-auto">
                      <p className="mt-6 text-base leading-7 text-gray-600">
                        Lorem ipsum dolor sit amet consect etur adipisicing elit. Itaque amet indis perferendis blanditiis
                        repellendus etur quidem assumenda.
                      </p>
                    </div>

                    <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                      <div className="rounded-2xl bg-gray-50 py-10 ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                        <div className="mx-auto max-w-xs px-8">
                          <p className="text-base font-semibold text-gray-600">Staked assets (60.2%)</p>
                          <p className="mt-2 flex items-baseline justify-center gap-x-2">
                            <span className="text-5xl font-bold tracking-tight text-gray-900">$58,656</span>
                            <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">USD</span>
                          </p>

                          <p className="mt-3 text-sm leading-6 text-gray-500">APR 6.67 | Yearly Yield $3,918</p>
                          
                          <div className="mt-3 relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                              <div className="w-full border-t border-gray-300" />
                            </div>
                          </div>

                          <ul role="list" className="mt-6 space-y-3 text-sm leading-6 text-gray-600">
                              <li key="5 products" className="flex gap-x-3">
                                <CheckCircleIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                5 products
                              </li>
                              <li key="5 products" className="flex gap-x-3">
                                <CheckCircleIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                5 products
                              </li>
                              <li key="5 products" className="flex gap-x-3">
                                <CheckCircleIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                5 products
                              </li>
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

      <ModelStats />
      <CreateModal factoryAddress={factoryAddress} />
    </div>
  )
}

export default function App() {
  let factoryAddress = '0x96F4c2b61F23324A3C29DDF47b898F02eaCA3839';

  useEffect(() => {
    document.title = "Dashboard - Restaking";
    document.documentElement.setAttribute("data-theme", "black");
    document.documentElement.className = 'bg-base-300';
  });

  return (
    <Page>
      <Navbar />
      <Content factoryAddress={factoryAddress} />
    </Page>
  );
};

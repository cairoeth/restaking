import React from "react";
import { useState, useEffect } from 'react'

const stats = [
  {
    name: 'Trained on',
    value: 30,
    verified: false
  },
  {
    name: 'R^2',
    value: 95,
    verified: true
  },
  {
    name: 'MAE',
    value: 30,
    verified: false
  }
]

export function ModelStats() {
  return (
    <>
      <input type="checkbox" id="modelStats" className="modal-toggle" />
      <label htmlFor="modelStats" className="modal">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">Characteristics of the pricing algorithm</h3>
          <p className="py-4">Several of the properties have been guaranteed by zkSNARKs</p>
          <div className='w-full grid-cols-9 gap-2 overflow-y-hidden overflow-x-scroll px-10 pt-1 pb-10 xl:grid xl:overflow-x-auto xl:px-4'>

            {stats.map((stat, index) => (
              <>
                <div className="col-span-2">
                  <b>{stat.name == 'R^2' ? <span>R<sup>2</sup></span> : <span>{stat.name}</span>}</b>
                </div>
                <div className="col-span-1 h-full">
                  {stat.value}%
                </div>
                <div className="col-span-4 h-full">
                  <progress max="100" value={stat.value} className="progress progress-warning"></progress>
                </div>
                <div className="col-span-2 h-full">
                  {stat.verified ?
                    <span className="badge badge-primary w-max">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      zkSNARK
                    </span>
                    : ''}
                </div>
              </>
            ))}
          </div>
        </label>
      </label>
    </>
  )
}
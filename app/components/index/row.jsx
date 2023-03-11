import { useEffect, useState, React } from 'react'
import { utils } from 'ethers'

const APIKEY = 'ckey_416cbb953a0a493998331731c51';


export function Row({ index }) {
  const [avatarUrl, setAvatarUrl] = useState([]);
  const [collectionName, setCollectionName] = useState("");

  useEffect(() => {
    async function setCollectionImg(tokenId) {
      const url = new URL(`https://api.covalenthq.com/v1/1/tokens/${index._collection}/nft_metadata/${tokenId}/?quote-currency=USD&format=JSON&key=${APIKEY}`);
      const response = await fetch(url);
      const result = await response.json();
      const data = result.data;

      try {
        setAvatarUrl([...avatarUrl, data.items[0].nft_data[0].external_data.image]);
        setCollectionName(data.items[0].contract_ticker_symbol);
      } catch (error) {
        console.log(error);
      }
    }
    setCollectionImg(100);
  }, []);

  console.log(index);
  return (
    <tr>
      <td>
        <a href={'/positions/' + index._index}>
        <div className="flex items-center space-x-3">
          <div className="avatar online placeholder">
            <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
              <img src={avatarUrl[0]} alt="Avatar Tailwind CSS Component" />
            </div>
          </div>
          <div>
            <div className="font-bold">{index._name}</div>
            <a href='#'>
              <span className="badge badge-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2">
                  <path fillRule="evenodd" d="M9.638 1.093a.75.75 0 01.724 0l2 1.104a.75.75 0 11-.724 1.313L10 2.607l-1.638.903a.75.75 0 11-.724-1.313l2-1.104zM5.403 4.287a.75.75 0 01-.295 1.019l-.805.444.805.444a.75.75 0 01-.724 1.314L3.5 7.02v.73a.75.75 0 01-1.5 0v-2a.75.75 0 01.388-.657l1.996-1.1a.75.75 0 011.019.294zm9.194 0a.75.75 0 011.02-.295l1.995 1.101A.75.75 0 0118 5.75v2a.75.75 0 01-1.5 0v-.73l-.884.488a.75.75 0 11-.724-1.314l.806-.444-.806-.444a.75.75 0 01-.295-1.02zM7.343 8.284a.75.75 0 011.02-.294L10 8.893l1.638-.903a.75.75 0 11.724 1.313l-1.612.89v1.557a.75.75 0 01-1.5 0v-1.557l-1.612-.89a.75.75 0 01-.295-1.019zM2.75 11.5a.75.75 0 01.75.75v1.557l1.608.887a.75.75 0 01-.724 1.314l-1.996-1.101A.75.75 0 012 14.25v-2a.75.75 0 01.75-.75zm14.5 0a.75.75 0 01.75.75v2a.75.75 0 01-.388.657l-1.996 1.1a.75.75 0 11-.724-1.313l1.608-.887V12.25a.75.75 0 01.75-.75zm-7.25 4a.75.75 0 01.75.75v.73l.888-.49a.75.75 0 01.724 1.313l-2 1.104a.75.75 0 01-.724 0l-2-1.104a.75.75 0 11.724-1.313l.888.49v-.73a.75.75 0 01.75-.75z" clipRule="evenodd" />
                </svg>
                {collectionName}
              </span>
            </a>
          </div>
        </div>
        </a>
      </td>
      <td>{ Math.round(utils.formatEther(index._price.toString())  * 100000) / 100000 } ETH</td>
      <td>{ index._volume.toNumber()} ({ index._count.toNumber()}) </td>
      <td>
        <div className="flex items-center">
          <div className="tooltip tooltip-bottom" data-tip="Verified using zkSNARKs">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
              <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
          </div>
          <label href="#" htmlFor="modelStats" className="a">{index._accuracy}%</label>
        </div>
      </td>
      <td>
        <a href='#'>
          {index._manipulation >= 0.7 ? <span className="ml-3 badge badge-error">High</span> : (index._manipulation >= 0.3 ? <span className="ml-3 badge badge-warning">Medium</span> : <span className="ml-3 badge badge-success">Low</span>)}
        </a>
      </td>
      <td>
        <a href='//github.com' className="tooltip tooltip-bottom" data-tip="Open GitHub">
          <span className="badge badge-ghost">{index._opensource ? 'Yes' : 'No'}</span>
        </a>
      </td>
    </tr>
  )
}
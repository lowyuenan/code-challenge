import React, { useState } from 'react'
import type { Price } from './schema'

interface Props {
  prices: Price[]
  currency: string
  updateCurrency: (currency: string) => () => void
}

export const CurrencySelector: React.FC<Props> = ({ currency, updateCurrency, prices }) => {
const [isList, setIsList] = useState(false)
    
  return (
    <div className={`select-currency ${isList?'show':''}`}>
      <div className='current-currency'>
        <div className='currency-label' onClick={() => setIsList(!isList)}>
          <img src={imgLink(currency)} alt={currency} />
          <span>{currency}</span>
        </div>
      </div>
      <ul className='' onClick={() => setIsList(false)}>
        {prices.map((price, index) => {
          return (
            <li value={price.currency} key={index} onClick={updateCurrency(price.currency)}>
              <div className='currency-label'>
                <img src={imgLink(price.currency)} alt={price.currency} />
                <span>{price.currency}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function imgLink(curr: Price['currency']) {
  switch (curr) {
    case 'STEVMOS': {
      curr = 'stEVMOS'
      break
    }
    case 'RATOM': {
      curr = 'rATOM'
      break
    }
    case 'STOSMO': {
      curr = 'stOSMO'
      break
    }
    case 'STATOM': {
      curr = 'stATOM'
      break
    }
    case 'STLUNA': {
      curr = 'stLUNA'
      break
    }
  }

  return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${curr}.svg`
}

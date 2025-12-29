import { useEffect, useState } from 'react'
import './style.css'
import { priceSchema, type Price } from './schema'
import { CurrencySelector, imgLink } from './currency-selector'

export default function Problem2() {
  const [prices, setPrices] = useState<Price[]>([])
  const [sendCurrency, setSendCurrency] = useState<string>('')
  const [receiveCurrency, setReceiveCurrency] = useState<string>('')
  const [inputAmount, setInputAmount] = useState<number>(10)
  const [outputAmount, setOutputAmount] = useState<number>(0)
  const [inputText, setInputText] = useState<string>('')
  const [outputText, setOutputText] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  useEffect(() => {
    let unmounted = false
    setIsLoading(true)
    fetch('https://interview.switcheo.com/prices.json')
      .then((res) => res.json())
      .then((json) => {
        const validator = priceSchema.array().safeParse(json)

        if (!validator.success) {
          throw 'Invalid prices data'
        }
        setIsLoading(false)
        if (!unmounted) {
          setPrices(
            validator.data.filter((it, index, self) => {
              return self.findIndex((price) => it.currency == price.currency) == index
            }),
          )
        }
      })
      .catch((err: Error) => console.error(err.message))

    return () => {
      unmounted = true
    }
  }, [])

  useEffect(() => {
    const fromPrice = prices[0]
    const toPrice = prices[1]

    if (!fromPrice || !toPrice) {
      return
    }

    setSendCurrency(fromPrice.currency)
    setReceiveCurrency(toPrice.currency)

    const convertValue = convertValueByCurreny({ fromValue: inputAmount, fromCurr: fromPrice.currency, toCurr: toPrice.currency })

    if (convertValue) {
      setOutputAmount(convertValue)
    }

    setInputText(`${inputAmount}`)
    setOutputText(`${convertValue}`)
  }, [prices])

  useEffect(() => {
    setIsSuccess(false)
  }, [sendCurrency, receiveCurrency, inputAmount, outputAmount, inputText, outputText])

  const convertValueByCurreny = ({ fromValue, fromCurr, toCurr }: { fromValue: number; fromCurr: Price['currency']; toCurr: Price['currency'] }) => {
    const fromPrice = prices.find((it) => it.currency == fromCurr)
    const toPrice = prices.find((it) => it.currency == toCurr)

    if (!toPrice || !fromPrice) {
      return
    }

    return Math.round((fromPrice.price / toPrice.price) * fromValue * 1000000) / 1000000
  }

  const onSendCurrencyChange = (currency: Price['currency']) => {
    return () => {
      setSendCurrency(currency)

      const convertValue = convertValueByCurreny({ fromValue: inputAmount, fromCurr: currency, toCurr: receiveCurrency })

      if (convertValue) {
        setOutputAmount(convertValue)
        setOutputText(`${convertValue}`)
      }
    }
  }

  const onReceiveCurrencyChange = (currency: Price['currency']) => {
    return () => {
      setReceiveCurrency(currency)

      const convertValue = convertValueByCurreny({ fromValue: inputAmount, fromCurr: sendCurrency, toCurr: currency })

      if (convertValue) {
        setOutputAmount(convertValue)
        setOutputText(`${convertValue}`)
      }
    }
  }

  const onInputAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)

    if (isNaN(value)) {
      return
    }

    const convertValue = convertValueByCurreny({ fromValue: value, fromCurr: sendCurrency, toCurr: receiveCurrency })

    setInputAmount(value)
    setInputText(`${value}`)

    if (convertValue) {
      setOutputAmount(convertValue)
      setOutputText(`${convertValue}`)
    }
  }

  const onOutputAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)

    if (isNaN(value)) {
      return
    }

    const convertValue = convertValueByCurreny({ fromValue: value, fromCurr: receiveCurrency, toCurr: sendCurrency })

    setOutputAmount(value)
    setOutputText(`${value}`)

    if (convertValue) {
      setInputAmount(convertValue)
      setInputText(`${convertValue}`)
    }
  }

  const onSubmit = () => {
    setIsLoading(true)

    // submit data
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
      return
    }, 2400)
  }

  return (
    <div className='page-wrapper'>
      <div className={`loading ${isLoading ? 'show' : ''}`}>
        <div></div>
      </div>
      <div className='title'>
        <h5>Swap</h5>
        {(() => {
          const send = prices.find((it) => it.currency == sendCurrency)
          const receive = prices.find((it) => it.currency == receiveCurrency)

          if (receive && send) {
            const ratio = Math.round((send.price / receive.price) * 1000000) / 1000000
            return (
              <span className='info'>
                1 {sendCurrency} = {`${ratio}`} {receiveCurrency}
              </span>
            )
          }
        })()}
      </div>

      <div className='form'>
        <div className='input-wrapper'>
          <label htmlFor='input-amount'>Amount to send</label>
          <div className='input-row'>
            <input id='input-amount' onChange={onInputAmountChange} type='number' min={0} step={0.0001} value={inputText} />
            <CurrencySelector currency={sendCurrency} updateCurrency={onSendCurrencyChange} prices={prices} />
          </div>
        </div>

        <div className='input-wrapper'>
          <label htmlFor='output-amount'>Amount to receive</label>
          <div className='input-row'>
            <input id='output-amount' onChange={onOutputAmountChange} type='number' min={0} step={0.0001} value={outputText} />
            <CurrencySelector currency={receiveCurrency} updateCurrency={onReceiveCurrencyChange} prices={prices} />
          </div>
        </div>
      </div>

      <div className='preview'>
        <span>{inputAmount}</span>
        <div className='currency-label'>
          <img src={imgLink(sendCurrency)} alt={sendCurrency} />
          <span>{sendCurrency}</span>
        </div>
        <span>=</span>
        <span>{outputAmount}</span>
        <div className='currency-label'>
          <img src={imgLink(receiveCurrency)} alt={receiveCurrency} />
          <span>{receiveCurrency}</span>
        </div>
      </div>

      <div className='confirm'>
        <span onClick={onSubmit}>CONFIRM SWAP</span>
      </div>
      {isSuccess && <p className='success-message'>Currency Swap Successfully!</p>}
    </div>
  )
}

import { useMemo } from 'react'

interface WalletBalance {
  currency: string
  amount: number
  blockchain: string
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props
  // assume these are imported
  const balances = useWalletBalances()
  const prices = usePrices()

  const getPriority = (blockchain: WalletBalance['blockchain']): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100
      case 'Ethereum':
        return 50
      case 'Arbitrum':
        return 30
      case 'Zilliqa':
        return 20
      case 'Neo':
        return 20
      default:
        return -99
    }
  }

  const sortedBalances = useMemo(() => {
    return balances
      .map((balance: WalletBalance) => {
        return {
          ...balance,
          priority: getPriority(balance.blockchain),
        }
      })
      .filter((balance: WalletBalance & { priority: number }) => {
        return balance.priority > -99 && balance.amount >= 0
      })
      .sort((lhs: WalletBalance & { priority: number }, rhs: WalletBalance & { priority: number }) => {
        return rhs.priority - lhs.priority
      })
  }, [balances])

  const rows = useMemo(() => {
    return sortedBalances
      .map((balance: WalletBalance) => {
        return {
          ...balance,
          formatted: balance.amount.toFixed(5),
        }
      })
      .map((balance: FormattedWalletBalance) => {
        const usdValue = prices[balance.currency] * balance.amount

        if (isNaN(usdValue)) {
          // return error or empty element
        }

        return (
          // assume 'WalletRow' is imported
          <WalletRow
            //  assume classes is define
            className={classes.row}
            key={balance.currency}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}
          />
        )
      })
  }, [sortedBalances, prices])

  return <div {...rest}>{rows}</div>
}

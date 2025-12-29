// blockchain is not declare here
interface WalletBalance {
  currency: string
  amount: number
}

// we can extends "WalletBalance"
interface FormattedWalletBalance {
  currency: string
  amount: number
  formatted: string
}

// Replace 'BoxProps'
interface Props extends BoxProps {}

// export this page
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props
  // assume these are imported
  const balances = useWalletBalances()
  const prices = usePrices()

// Avoid using 'any'
  const getPriority = (blockchain: any): number => {
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
    // we can define all "Priority" before filter and sort, to avoid call "getPriority" multiple time in sort
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain)
        //   lhsPriority is undefined, use 'balancePriority'
        if (lhsPriority > -99) {
          // amount should be larger than or equal to 0?
          if (balance.amount <= 0) {
            return true
          }
        }
        return false
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain)
        const rightPriority = getPriority(rhs.blockchain)
        // we can use rhs - lhs for sort DESC
        if (leftPriority > rightPriority) {
          return -1
        } else if (rightPriority > leftPriority) {
          return 1
        }
      })
    // "prices" does not affects here.
  }, [balances, prices])

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      // toFixed without arg, it is bad ti round to integer.
      formatted: balance.amount.toFixed(),
    }
  })
  

  // rows can useMemo too
  // should use "formattedBalances" here, or add the map function here
  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    // Is all types of currency are in the prices? If not we have to validate
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      // assume 'WalletRow' is imported
      <WalletRow 
        // classes is not defined
        className={classes.row}
        // rerender might have bug here after the balances sorted, should use currency if currency is unique.
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}

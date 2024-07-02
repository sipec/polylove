import { PrivateUser, User } from 'common/user'
import { useState } from 'react'
import { api } from 'web/lib/api'
import { Col } from '../layout/col'
import { InfoTooltip } from '../widgets/info-tooltip'
import ShortToggle from '../widgets/short-toggle'

export const Settings = (props: { user: User; privateUser: PrivateUser }) => {
  const { user, privateUser } = props

  const [betWarnings, setBetWarnings] = useState(!user.optOutBetWarnings)
  const [advancedTraderMode, setAdvancedTraderMode] = useState(
    !!user.isAdvancedTrader
  )

  return (
    <Col className="gap-2">
      <div>
        <label className="mb-1 block">
          Advanced trader mode <InfoTooltip text={'More advanced betting UI'} />
        </label>
        <ShortToggle
          on={advancedTraderMode}
          setOn={(enabled) => {
            setAdvancedTraderMode(enabled)
            api('me/update', { isAdvancedTrader: enabled })
          }}
        />
      </div>
      <div>
        <label className="mb-1 block">
          Bet warnings{' '}
          <InfoTooltip
            text={
              'Warnings before you place a bet that is either 1. a large portion of your balance, or 2. going to move the probability by a large amount'
            }
          />
        </label>
        <ShortToggle
          on={betWarnings}
          setOn={(enabled) => {
            setBetWarnings(enabled)
            api('me/update', { optOutBetWarnings: !enabled })
          }}
        />
      </div>
    </Col>
  )
}

import { PrivateUser, User } from 'common/user'
import { getLoverRow } from 'common/love/lover'
import { getNotificationDestinationsForUser } from 'common/user-notification-preferences'
import { createSupabaseClient } from 'shared/supabase/init'
import { getUser } from 'shared/utils'
import { sendEmail } from './send-email'
import { NewMatchEmail } from '../new-match'
import { NewMessageEmail } from '../new-message'
import { NewEndorsementEmail } from '../new-endorsement'
import { Test } from '../test'

const from = 'Love <no-reply@poly.love>'

export const sendNewMatchEmail = async (
  privateUser: PrivateUser,
  matchedWithUser: User
) => {
  const { sendToEmail, unsubscribeUrl } = getNotificationDestinationsForUser(
    privateUser,
    'new_match'
  )
  if (!privateUser.email || !sendToEmail) return
  const user = await getUser(privateUser.id)
  if (!user) return

  const lover = await getLoverRow(matchedWithUser.id, createSupabaseClient())

  return await sendEmail({
    from,
    subject: `You have a new match!`,
    to: privateUser.email,
    react: (
      <NewMatchEmail
        onUser={user}
        matchedWithUser={matchedWithUser}
        matchedLover={lover}
        unsubscribeUrl={unsubscribeUrl}
      />
    ),
  })
}

export const sendNewMessageEmail = async (
  privateUser: PrivateUser,
  fromUser: User,
  toUser: User,
  channelId: number
) => {
  const { sendToEmail, unsubscribeUrl } = getNotificationDestinationsForUser(
    privateUser,
    'new_message'
  )
  if (!privateUser.email || !sendToEmail) return

  const lover = await getLoverRow(fromUser.id, createSupabaseClient())

  return await sendEmail({
    from,
    subject: `${fromUser.name} sent you a message!`,
    to: privateUser.email,
    react: (
      <NewMessageEmail
        fromUser={fromUser}
        fromUserLover={lover}
        toUser={toUser}
        channelId={channelId}
        unsubscribeUrl={unsubscribeUrl}
      />
    ),
  })
}

export const sendNewEndorsementEmail = async (
  privateUser: PrivateUser,
  fromUser: User,
  onUser: User,
  text: string
) => {
  const { sendToEmail, unsubscribeUrl } = getNotificationDestinationsForUser(
    privateUser,
    'new_endorsement'
  )
  if (!privateUser.email || !sendToEmail) return

  return await sendEmail({
    from,
    subject: `${fromUser.name} just endorsed you!`,
    to: privateUser.email,
    react: (
      <NewEndorsementEmail
        fromUser={fromUser}
        onUser={onUser}
        endorsementText={text}
        unsubscribeUrl={unsubscribeUrl}
      />
    ),
  })
}

export const sendTestEmail = async (toEmail: string) => {
  return await sendEmail({
    from,
    subject: 'Test email from Love',
    to: toEmail,
    react: <Test name="Test User" />,
  })
}

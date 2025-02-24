import { LOVE_DOMAIN } from 'common/envs/constants'
import { PrivateUser, User } from 'common/user'
import { getLoverRow } from 'common/love/lover'
import { getLoveOgImageUrl } from 'common/love/og-image'
import { NotificationReason } from 'common/notifications'
import { getNotificationDestinationsForUser } from 'common/user-notification-preferences'
import { createSupabaseClient } from 'shared/supabase/init'
import { getUser } from 'shared/utils'
import { sendTemplateEmail } from './send-email'

export const sendNewMatchEmail = async (
  reason: NotificationReason,
  privateUser: PrivateUser,
  // contract: Contract, 
  creatorName: string,
  matchedWithUser: User 
) => {
  const { sendToEmail, unsubscribeUrl } = getNotificationDestinationsForUser(
    privateUser,
    reason
  )
  if (!privateUser.email || !sendToEmail) return
  const user = await getUser(privateUser.id)
  if (!user) return

  const { name } = user
  const firstName = name.split(' ')[0]
  const lover = await getLoverRow(matchedWithUser.id, createSupabaseClient())
  const loveOgImageUrl = getLoveOgImageUrl(matchedWithUser, lover)
  // const questionImgSrc = imageSourceUrl(contract)
  return await sendTemplateEmail(
    privateUser.email,
    `You have a new match!`,
    'new-match',
    {
      name: firstName,
      creatorName,
      unsubscribeUrl,
      // questionTitle: contract.question,
      // questionUrl: `https://${LOVE_DOMAIN}${contractPath(contract)}`,
      userUrl: `https://${LOVE_DOMAIN}/${matchedWithUser.username}`,
      matchedUsersName: matchedWithUser.name,
      userImgSrc: loveOgImageUrl,
      // questionImgSrc,
    },
    {
      from: `manifold.love <no-reply@manifold.markets>`,
    }
  )
}
export const sendNewMessageEmail = async (
  reason: NotificationReason,
  privateUser: PrivateUser,
  fromUser: User,
  toUser: User,
  channelId: number,
  subject: string
) => {
  const { sendToEmail, unsubscribeUrl } = getNotificationDestinationsForUser(
    privateUser,
    reason
  )
  if (!privateUser.email || !sendToEmail) return
  const firstName = toUser.name.split(' ')[0]
  const lover = await getLoverRow(fromUser.id, createSupabaseClient())
  const loveOgImageUrl = getLoveOgImageUrl(fromUser, lover)

  return await sendTemplateEmail(
    privateUser.email,
    subject,
    'new-message',
    {
      name: firstName,
      messagesUrl: `https://${LOVE_DOMAIN}/messages/${channelId}`,
      creatorName: fromUser.name,
      userImgSrc: loveOgImageUrl,
      unsubscribeUrl,
    },
    {
      from: `manifold.love <no-reply@manifold.markets>`,
    }
  )
}

export const sendNewEndorsementEmail = async (
  reason: NotificationReason,
  privateUser: PrivateUser,
  fromUser: User,
  onUser: User,
  subject: string,
  text: string
) => {
  const { sendToEmail, unsubscribeUrl } = getNotificationDestinationsForUser(
    privateUser,
    reason
  )
  if (!privateUser.email || !sendToEmail) return
  const firstName = onUser.name.split(' ')[0]
  return await sendTemplateEmail(
    privateUser.email,
    subject,
    'new-endorsement',
    {
      name: firstName,
      endorsementUrl: `https://${LOVE_DOMAIN}/${onUser.username}`,
      creatorName: fromUser.name,
      creatorAvatarUrl: fromUser.avatarUrl,
      endorsementText: text,
      unsubscribeUrl,
    },
    {
      from: `manifold.love <no-reply@manifold.markets>`,
    }
  )
}

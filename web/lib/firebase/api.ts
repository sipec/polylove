import { JSONContent } from '@tiptap/core'
import { API, APIParams, APIPath, APIResponse } from 'common/api/schema'
import { getApiUrl } from 'common/api/utils'
import { Json } from 'common/supabase/schema'
import { baseApiCall, formatApiUrlWithParams } from 'common/util/api'
import { removeNullOrUndefinedProps } from 'common/util/object'
import { sleep } from 'common/util/time'
import { auth } from './users'
import { ReportProps } from 'common/report'
export { APIError } from 'common/api/utils'

// This is the preferred way of using the api going forward
export async function api<P extends APIPath>(path: P, params: APIParams<P>) {
  // If the api is authed and the user is not loaded, wait for the user to load.
  if (API[path].authed && !auth.currentUser) {
    let i = 0
    while (!auth.currentUser) {
      i++
      await sleep(i * 10)
      if (i > 10) {
        console.error('User did not load after 10 iterations')
        break
      }
    }
  }

  return (await call(
    formatApiUrlWithParams(path, params),
    API[path].method,
    params
  )) as Promise<APIResponse<P>>
}

// helper function for the old apis so we don't have to migrate them
function curriedAPI<P extends APIPath>(path: P) {
  return (params: APIParams<P>) => api(path, params)
}

export async function call(
  url: string,
  method: 'POST' | 'PUT' | 'GET',
  params?: any
) {
  return baseApiCall(url, method, params, auth.currentUser)
}

export function createLover(params: any) {
  return call(getApiUrl('create-lover'), 'POST', params)
}

export function updateLover(params: any) {
  return call(
    getApiUrl('update-lover'),
    'POST',
    removeNullOrUndefinedProps(params, ['bio'])
  )
}

export function createCommentOnLover(params: {
  userId: string
  content: JSONContent
  replyToCommentId?: string
}) {
  return call(getApiUrl('create-comment-on-lover'), 'POST', params)
}

export function hideCommentOnLover(params: {
  commentId: string
  hide: boolean
}) {
  return call(getApiUrl('hide-comment-on-lover'), 'POST', params)
}

export function createLoveCompatibilityQuestion(params: {
  question: string
  options: Json
}) {
  return call(getApiUrl('createlovecompatibilityquestion'), 'POST', params)
}

export function sendUserPrivateMessage(params: {
  channelId: number
  content: JSONContent
}) {
  return call(getApiUrl('create-private-user-message'), 'POST', params)
}

export function leavePrivateMessageChannel(params: { channelId: number }) {
  return call(getApiUrl('leave-private-user-message-channel'), 'POST', params)
}
export function updatePrivateMessageChannel(params: {
  channelId: number
  notifyAfterTime: number
}) {
  return call(getApiUrl('update-private-user-message-channel'), 'POST', params)
}

export function searchLocation(params: { term: string; limit?: number }) {
  return call(getApiUrl('searchlocation'), 'POST', params)
}

export function searchNearCity(params: { cityId: string; radius: number }) {
  if (params.radius < 1 || params.radius > 500) {
    throw new Error('Your radius is out of bounds!')
  }
  return call(getApiUrl('searchnearcity'), 'POST', params)
}

export function referUser(params: {
  referredByUsername: string
  contractId?: string
}) {
  return call(getApiUrl('refer-user'), 'POST', params)
}

export const updateUser = curriedAPI('me/update')

export function markAllNotifications(params: any) {
  return call(getApiUrl('markallnotifications'), 'POST', params)
}

export function createPrivateMessageChannelWithUsers(params: {
  userIds: string[]
}) {
  return call(getApiUrl('create-private-user-message-channel'), 'POST', params)
}

export function report(params: ReportProps) {
  return call(getApiUrl('report'), 'POST', params)
}

export function banUser(params: { userId: string; unban?: boolean }) {
  return call(getApiUrl('ban-user'), 'POST', params)
}

export function searchGiphy(params: { term: string; limit: number }) {
  return call(getApiUrl('searchgiphy'), 'POST', params)
}

export function getSupabaseToken() {
  return call(getApiUrl('getsupabasetoken'), 'GET')
}

export function createUser(params: any) {
  return call(getApiUrl('createuser'), 'POST', params)
}

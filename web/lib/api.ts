import { API, APIParams, APIPath, APIResponse } from 'common/api/schema'
import { baseApiCall, formatApiUrlWithParams } from 'common/util/api'
import { sleep } from 'common/util/time'
import { auth } from './firebase/users'
import { omitBy, isNull } from 'lodash'
export { APIError } from 'common/api/utils'

export async function api<P extends APIPath>(
  path: P,
  params: APIParams<P> = {}
) {
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

  return (await baseApiCall(
    formatApiUrlWithParams(path, params),
    API[path].method,
    params,
    auth.currentUser
  )) as Promise<APIResponse<P>>
}

function curriedAPI<P extends APIPath>(path: P) {
  return (params: APIParams<P>) => api(path, params)
}

export const updateLover = (props: Record<string, any>) =>
  api('update-lover', omitBy(props, isNull) as any)

curriedAPI('update-lover')
export const updateUser = curriedAPI('me/update')
export const report = curriedAPI('report')

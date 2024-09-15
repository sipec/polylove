import { isVerified, MINUTES_ALLOWED_TO_REFER, User } from 'common/user'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import {
  GoogleAuthProvider,
  OAuthProvider,
  getAuth,
  signInWithPopup,
} from 'firebase/auth'
import { getIsNative } from 'web/lib/native/is-native'
import { nativeSignOut } from 'web/lib/native/native-messages'
import { safeLocalStorage } from '../util/local'
import { app } from './init'
import { postMessageToNative } from 'web/lib/native/post-message'

dayjs.extend(utc)

export type { User }

export const auth = getAuth(app)

export const CACHED_REFERRAL_USERNAME_KEY = 'CACHED_REFERRAL_KEY'

// Scenarios:
// 1. User is referred by another user to homepage, group page, market page etc. explicitly via referrer= query param
// 2. User lands on a market or group without a referrer, we attribute the market/group creator
// Explicit referrers take priority over the implicit ones, (e.g. they're overwritten)
export function writeReferralInfo(
  defaultReferrerUsername: string,
  otherOptions?: {
    contractId?: string
    explicitReferrer?: string
  }
) {
  const local = safeLocalStorage
  const cachedReferralUser = local?.getItem(CACHED_REFERRAL_USERNAME_KEY)
  const { explicitReferrer } = otherOptions || {}

  // Write the first referral username we see.
  if (!cachedReferralUser) {
    local?.setItem(
      CACHED_REFERRAL_USERNAME_KEY,
      explicitReferrer || defaultReferrerUsername
    )
  }

  // Overwrite all referral info if we see an explicit referrer.
  if (explicitReferrer) {
    local?.setItem(CACHED_REFERRAL_USERNAME_KEY, explicitReferrer)
  }
}

export async function firebaseLogin() {
  if (getIsNative()) {
    // Post the message back to expo
    postMessageToNative('loginClicked', {})
    return
  }
  const provider = new GoogleAuthProvider()
  return signInWithPopup(auth, provider).then(async (result) => {
    return result
  })
}

export async function loginWithApple() {
  const provider = new OAuthProvider('apple.com')
  provider.addScope('email')
  provider.addScope('name')

  return signInWithPopup(auth, provider)
    .then((result) => {
      return result
    })
    .catch((error) => {
      console.error(error)
    })
}

export async function firebaseLogout() {
  if (getIsNative()) nativeSignOut()

  await auth.signOut()
}

export const canSetReferrer = (user: User) => {
  if (user.referredByUserId) return false
  if (!isVerified(user)) return false
  const now = dayjs().utc()
  const userCreatedTime = dayjs(user.createdTime)
  return now.diff(userCreatedTime, 'minute') < MINUTES_ALLOWED_TO_REFER
}

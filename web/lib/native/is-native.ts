import { IS_NATIVE_KEY, PLATFORM_KEY } from 'common/native-message'
import { safeLocalStorage, safeSessionStorage } from 'web/lib/util/local'

export const getIsNative = () => {
  // TODO cache the result of this in memory
  const { isNative } = getNativeInfo()
  return isNative
}

export const getNativePlatform = () => {
  return getNativeInfo()
}

const getNativeInfo = () => {
  if (typeof window === 'undefined') return { isNative: false, platform: '' }
  const local = safeLocalStorage
  const ss = safeSessionStorage
  const isNative = local?.getItem(IS_NATIVE_KEY) || ss?.getItem(IS_NATIVE_KEY)
  const platform = local?.getItem(PLATFORM_KEY) || ss?.getItem(PLATFORM_KEY)
  return { isNative: isNative === 'true', platform }
}

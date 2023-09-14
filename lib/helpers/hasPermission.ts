import { mappings } from './permissions'
function getCookie(cookieName: string) {
  if (typeof document !== 'undefined') {
    const name = cookieName + '='
    const decodedCookie = decodeURIComponent(window.document.cookie)
    const cookieArray = decodedCookie.split(';')

    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i]
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1)
      }
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length)
      }
    }
  }
  return ''
}
function getUserBehaviors() {
  const behaviorsFromCookie = getCookie('behaviors')
  if (!behaviorsFromCookie) return [0]
  const behaviorsFromCookieArray = behaviorsFromCookie?.split(',')
  const behaviors = behaviorsFromCookieArray.map((value) => parseInt(value, 10))
  return behaviors
}

export const hasPermission = (action: any) => {
  const userBehaviors = getUserBehaviors()
  let canAccess = false

  // For users having behaviors
  userBehaviors.forEach((behavior) => {
    if (mappings.has(behavior)) {
      const permissions = mappings.get(behavior)?.includes(action)
      if (permissions) canAccess = true
    }
  })

  return canAccess
}

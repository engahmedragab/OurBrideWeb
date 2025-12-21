// Device information utilities for guest login

/**
 * Get device information for guest login
 */
export const getDeviceInfo = () => {
  if (typeof window === 'undefined') {
    return {
      deviceId: 'unknown',
      deviceName: 'Unknown Device',
      operatingSystem: 'Unknown',
      isPhysicalDevice: false,
      userAgent: 'Unknown',
      browserName: 'Unknown',
      browserVersion: 'Unknown',
      platform: 'Unknown',
      language: 'en',
      timeZone: 'UTC',
      screenResolution: 'Unknown',
      colorDepth: 'Unknown',
      cookiesEnabled: false,
      javaScriptEnabled: true,
    }
  }

  const userAgent = navigator.userAgent
  const platform = navigator.platform || 'Unknown'
  const language = navigator.language || 'en'
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'

  // Generate a device ID (use existing or create new)
  let deviceId = localStorage.getItem('device_id')
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('device_id', deviceId)
  }

  // Detect browser
  let browserName = 'Unknown'
  let browserVersion = 'Unknown'
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    browserName = 'Chrome'
    const match = userAgent.match(/Chrome\/(\d+)/)
    browserVersion = match ? match[1] : 'Unknown'
  } else if (userAgent.includes('Firefox')) {
    browserName = 'Firefox'
    const match = userAgent.match(/Firefox\/(\d+)/)
    browserVersion = match ? match[1] : 'Unknown'
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browserName = 'Safari'
    const match = userAgent.match(/Version\/(\d+)/)
    browserVersion = match ? match[1] : 'Unknown'
  } else if (userAgent.includes('Edg')) {
    browserName = 'Edge'
    const match = userAgent.match(/Edg\/(\d+)/)
    browserVersion = match ? match[1] : 'Unknown'
  }

  // Detect OS
  let operatingSystem = 'Unknown'
  if (userAgent.includes('Windows')) {
    operatingSystem = 'Windows'
  } else if (userAgent.includes('Mac')) {
    operatingSystem = 'macOS'
  } else if (userAgent.includes('Linux')) {
    operatingSystem = 'Linux'
  } else if (userAgent.includes('Android')) {
    operatingSystem = 'Android'
  } else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    operatingSystem = 'iOS'
  }

  // Screen resolution
  const screenResolution = `${window.screen.width}x${window.screen.height}`
  const colorDepth = `${window.screen.colorDepth} bit`

  // Check cookies
  const cookiesEnabled = navigator.cookieEnabled

  return {
    deviceId,
    deviceName: `${operatingSystem} Device`,
    model: platform,
    operatingSystem,
    isPhysicalDevice: true, // Assume true for web browsers
    appName: 'OurBride Web',
    packageName: 'com.ourbride.web',
    version: '1.0.0', // You can get this from package.json or env
    buildNumber: '1',
    userAgent,
    browserName,
    browserVersion,
    platform,
    language,
    timeZone,
    screenResolution,
    colorDepth,
    cookiesEnabled,
    javaScriptEnabled: true,
  }
}

/**
 * Get geolocation if available (requires user permission)
 */
export const getGeolocation = (): Promise<{ latitude: number; longitude: number } | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      () => {
        resolve(null)
      },
      { timeout: 5000 }
    )
  })
}


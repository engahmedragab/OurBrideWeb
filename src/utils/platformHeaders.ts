type PlatformHeaders = {
  'X-Platform-Name': string
  'X-Platform-Channel': string
  'X-Platform-Version'?: string
}

const getPlatformName = (): string => {
  return process.env.NEXT_PUBLIC_PLATFORM_NAME || 'ourbride'
}

const getPlatformChannel = (): string => {
  return process.env.NEXT_PUBLIC_PLATFORM_CHANNEL || 'web'
}

const getPlatformVersion = (): string => {
  return (
    process.env.NEXT_PUBLIC_SOURCE_VERSION ||
    process.env.NEXT_PUBLIC_APP_VERSION ||
    process.env.NEXT_PUBLIC_VERSION ||
    'dev'
  )
}

export const getPlatformHeaders = (): PlatformHeaders => {
  const headers: PlatformHeaders = {
    'X-Platform-Name': getPlatformName(),
    'X-Platform-Channel': getPlatformChannel(),
  }

  const version = getPlatformVersion()
  if (version) {
    headers['X-Platform-Version'] = version
  }

  return headers
}

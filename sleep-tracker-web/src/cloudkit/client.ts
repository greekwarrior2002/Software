// @ts-expect-error — tsl-apple-cloudkit ships CommonJS without ESM types
import CloudKit from 'tsl-apple-cloudkit'

// Container ID must match the iCloud container in SleepTracker.entitlements
const CONTAINER_ID = import.meta.env.VITE_CLOUDKIT_CONTAINER_ID as string
const API_TOKEN    = import.meta.env.VITE_CLOUDKIT_API_TOKEN as string

if (!CONTAINER_ID || !API_TOKEN) {
  console.warn('CloudKit env vars not set. Copy .env.example to .env and fill in values.')
}

const ck: typeof CloudKit = CloudKit.configure({
  containers: [{
    containerIdentifier: CONTAINER_ID,
    apiTokenAuth: { apiToken: API_TOKEN, persist: true },
    environment: (import.meta.env.PROD ? 'production' : 'development') as 'production' | 'development',
  }],
})

export const container = ck.getDefaultContainer()
export const privateDB  = container.privateCloudDatabase

export async function signIn(): Promise<void> {
  await container.setUpAuth()
}

export function isSignedIn(): boolean {
  return container.isDiscoverable ?? false
}

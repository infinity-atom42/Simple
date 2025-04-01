import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'

import { AUTH_SESSION_COOKIE_NAME, encodedSecretKey, type AuthSession } from './config'

// Decrypt JWT to get session data
export async function getCallbackSession(): Promise<AuthSession> {
	const cookieStore = await cookies()

	const sessionAuthCookie = cookieStore.get(AUTH_SESSION_COOKIE_NAME)

	if (!sessionAuthCookie?.value) {
		throw new Error('No auth session cookie found')
	}

	const { payload } = await jwtVerify(sessionAuthCookie.value, encodedSecretKey, {
		algorithms: ['HS256'],
	})

	return payload as unknown as AuthSession
}

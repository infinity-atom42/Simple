import { SignJWT } from 'jose'
import { cookies } from 'next/headers'

import { AUTH_SESSION_COOKIE_NAME, AUTH_SESSION_LIFESPAN, AuthSession, encodedSecretKey } from './config'

export async function saveCallbackSession(session: AuthSession) {
	const cookieStore = await cookies()

	const encryptedSession = await new SignJWT({
		code_verifier: session.code_verifier,
		state: session.state,
	})
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(`${AUTH_SESSION_LIFESPAN}s`)
		.sign(encodedSecretKey)

	cookieStore.set(AUTH_SESSION_COOKIE_NAME, encryptedSession, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: AUTH_SESSION_LIFESPAN,
		priority: 'high',
		path: '/',
		domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN_NAME! : undefined,
	})
}

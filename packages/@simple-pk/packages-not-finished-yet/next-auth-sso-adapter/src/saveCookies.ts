import 'server-only'

import { type ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { cookies } from 'next/headers'

import {
	ACCESS_TOKEN_COOKIE_NAME,
	ACCESS_TOKEN_LIFESPAN,
	ID_TOKEN_COOKIE_NAME,
	ID_TOKEN_LIFESPAN,
	REFRESH_TOKEN_COOKIE_NAME,
	REFRESH_TOKEN_LIFESPAN,
} from './config'

export async function saveAccessToken(
	access_token: string,
	lifespan: number | undefined,
	cookieStore?: ReadonlyRequestCookies,
) {
	const store = cookieStore || (await cookies())

	store.set(ACCESS_TOKEN_COOKIE_NAME, access_token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax', // TODO: Change to strict for further security
		maxAge: lifespan && lifespan > 0 ? lifespan : ACCESS_TOKEN_LIFESPAN,
		priority: 'high',
		path: '/',
		domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN_NAME! : undefined,
	})
}

export async function saveIdToken(
	id_token: string,
	lifespan: number | undefined,
	cookieStore?: ReadonlyRequestCookies,
) {
	const store = cookieStore || (await cookies())

	store.set(ID_TOKEN_COOKIE_NAME, id_token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax', // TODO: Change to strict for further security
		maxAge: lifespan && lifespan > 0 ? lifespan : ID_TOKEN_LIFESPAN,
		priority: 'high',
		path: '/',
		domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN_NAME! : undefined,
	})
}

export async function saveRefreshToken(
	refresh_token: string,
	lifespan: number | undefined,
	cookieStore?: ReadonlyRequestCookies,
) {
	const store = cookieStore || (await cookies())

	store.set(REFRESH_TOKEN_COOKIE_NAME, refresh_token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax', // TODO: Change to strict for further security
		maxAge: lifespan && lifespan > 0 ? lifespan : REFRESH_TOKEN_LIFESPAN,
		priority: 'high',
		path: '/',
		domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN_NAME! : undefined,
	})
}

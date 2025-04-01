import 'server-only'

import { cookies } from 'next/headers'

import { ACCESS_TOKEN_COOKIE_NAME, ID_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from './config'

export async function getAccessToken() {
	const cookieStore = await cookies()

	const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)
	if (!accessToken) {
		return null
	}

	return accessToken.value
}

export async function getIdToken() {
	const cookieStore = await cookies()

	const idToken = cookieStore.get(ID_TOKEN_COOKIE_NAME)
	if (!idToken) {
		return null
	}

	return idToken.value
}

export async function getRefreshToken() {
	const cookieStore = await cookies()

	const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)
	if (!refreshToken) {
		return null
	}

	return refreshToken.value
}

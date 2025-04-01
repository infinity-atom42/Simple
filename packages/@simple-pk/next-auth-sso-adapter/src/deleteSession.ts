import 'server-only'

import { cookies } from 'next/headers'

import {
	ACCESS_TOKEN_COOKIE_NAME,
	AUTH_SESSION_COOKIE_NAME,
	ID_TOKEN_COOKIE_NAME,
	REFRESH_TOKEN_COOKIE_NAME,
} from './config'

// Delete all session cookies
export async function deleteCookies() {
	const cookieStore = await cookies()
	cookieStore.delete(AUTH_SESSION_COOKIE_NAME)
	cookieStore.delete(ACCESS_TOKEN_COOKIE_NAME)
	cookieStore.delete(ID_TOKEN_COOKIE_NAME)
	cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME)
}

export async function deleteCallbackSession() {
	const cookieStore = await cookies()
	cookieStore.delete(AUTH_SESSION_COOKIE_NAME)
}

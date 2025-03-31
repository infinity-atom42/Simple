import { cookies } from 'next/headers'
import { TokenEndpointResponse, TokenEndpointResponseHelpers } from 'openid-client'

import { saveAccessToken, saveIdToken, saveRefreshToken } from './saveCookies'

export async function saveAuthTokens(tokenSet: TokenEndpointResponse & TokenEndpointResponseHelpers) {
	const { access_token, refresh_token, expires_in, id_token } = tokenSet
	const cookieStore = await cookies()

	const cookiePromises = []

	cookiePromises.push(saveAccessToken(access_token, expires_in, cookieStore))

	if (refresh_token) {
		cookiePromises.push(saveRefreshToken(refresh_token, 0, cookieStore))
	}

	if (id_token) {
		cookiePromises.push(saveIdToken(id_token, expires_in, cookieStore))
	}

	await Promise.all(cookiePromises)
}

import 'server-only'

import { refreshTokenGrant } from 'openid-client'

import { getClientConfig } from './client'
import { clientConfig } from './config'
import { saveAuthTokens } from './saveAuthTokens'

/**
 * Refreshes the access token using the refresh token
 * Returns true if successful, false otherwise
 */
export async function refreshAccessToken(refreshToken: string): Promise<boolean> {
	try {
		const openIdClientConfig = await getClientConfig()

		// Use the refreshTokenGrant with the refresh_token
		const tokenSet = await refreshTokenGrant(openIdClientConfig, refreshToken, {
			client_id: clientConfig.client_id,
			client_secret: clientConfig.client_secret,
		})

		await saveAuthTokens(tokenSet)

		return true
	} catch (error) {
		console.error('Failed to refresh access token:', error)
		return false
	}
}

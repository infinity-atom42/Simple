import { createRemoteJWKSet, jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

import { deleteCookies } from './deleteSession'
import { getAccessToken, getRefreshToken } from './getCookies'
import { refreshAccessToken } from './refreshToken'

export function createAuthMiddleware() {
	// Create JWKS client (will cache keys automatically)
	const JWKS = createRemoteJWKSet(new URL(process.env.KEYCLOAK_CERT_URL!), {
		headers: {}, // Optional headers for the request
		timeoutDuration: 5000, // Optional timeout
		cooldownDuration: 30000, // Optional cooldown between requests
	})

	// In development, we need to ignore SSL certificate validation
	if (process.env.NODE_ENV === 'development') {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
	}

	return async (request: NextRequest) => {
		// Continue with authentication logic
		const accessToken = await getAccessToken()

		// If access token exists, verify it
		if (accessToken) {
			try {
				await jwtVerify(accessToken, JWKS, {
					issuer: process.env.KEYCLOAK_ISSUER!,
					algorithms: ['RS256'],
				})

				return NextResponse.next()
			} catch (error) {
				console.error('Access token has been corrupted:', error)
				// delete the corrupted cookies and redirect to login
				await deleteCookies()
			}
		}
		// If no access token, try to refresh it
		if (!accessToken) {
			const refreshToken = await getRefreshToken()

			if (refreshToken) {
				const refreshed = await refreshAccessToken(refreshToken)

				if (refreshed) {
					return NextResponse.redirect(request.url)
				}
			}
		}

		// No access token and refresh failed, redirect to login
		const url = request.nextUrl.clone()
		url.pathname = '/auth/login'
		// Store the original URL to redirect back after login
		url.searchParams.set('returnUrl', request.nextUrl.pathname + request.nextUrl.search)
		return NextResponse.redirect(url)
	}
}

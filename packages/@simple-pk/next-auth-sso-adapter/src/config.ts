import 'server-only'

// Disable SSL verification in development environment
if (process.env.NODE_ENV === 'development') {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

export type AuthSession = {
	code_verifier: string
	state: string
}

export const clientConfig = {
	url: process.env.NEXT_PUBLIC_API_URL!,
	audience: process.env.NEXT_PUBLIC_API_URL!,
	client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
	client_secret: process.env.CLIENT_SECRET!,
	scope: process.env.NEXT_PUBLIC_SCOPE!,
	redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
	post_logout_redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL!}`,
	response_type: 'code',
	grant_type: 'authorization_code',
	post_login_route: `${process.env.NEXT_PUBLIC_APP_URL!}`,
	code_challenge_method: 'S256',
}

// Encoded secret key for session encryption
export const encodedSecretKey = new TextEncoder().encode(process.env.AUTH_SESSION_PASSWORD!)

// Names of the cookies to store different token types
export const ACCESS_TOKEN_COOKIE_NAME = process.env.ACCESS_TOKEN_COOKIE_NAME || 'access_token'
export const ID_TOKEN_COOKIE_NAME = process.env.ID_TOKEN_COOKIE_NAME || 'id_token'
export const REFRESH_TOKEN_COOKIE_NAME = process.env.REFRESH_TOKEN_COOKIE_NAME || 'refresh_token'

// Cookie lifespans in seconds
export const ACCESS_TOKEN_LIFESPAN = 300 // 5 minutes in seconds
export const ID_TOKEN_LIFESPAN = ACCESS_TOKEN_LIFESPAN // 5 minutes in seconds
export const REFRESH_TOKEN_LIFESPAN = 60 * 60 * 24 * 30 // 30 days in seconds

// Auth session lifespan and cookie name
export const AUTH_SESSION_COOKIE_NAME = process.env.AUTH_SESSION_COOKIE_NAME || 'auth_session'
export const AUTH_SESSION_LIFESPAN = 60 * 60 * 24 // 1 day in seconds

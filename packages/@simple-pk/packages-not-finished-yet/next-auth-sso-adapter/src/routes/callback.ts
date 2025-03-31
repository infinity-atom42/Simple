import { headers } from 'next/headers'
import { NextRequest } from 'next/server'
import { authorizationCodeGrant } from 'openid-client'

import { getClientConfig } from '../client'
import { clientConfig } from '../config'
import { deleteCallbackSession } from '../deleteSession'
import { getCallbackSession } from '../getCallbackSession'
import { saveAuthTokens } from '../saveAuthTokens'

export async function GET(request: NextRequest) {
	const session = await getCallbackSession()
	const openIdClientConfig = await getClientConfig()
	const headerList = await headers()
	const host = headerList.get('x-forwarded-host') || headerList.get('host') || 'localhost'
	const protocol = headerList.get('x-forwarded-proto') || 'https'
	const currentUrl = new URL(`${protocol}://${host}${request.nextUrl.pathname}${request.nextUrl.search}`)
	const tokenSet = await authorizationCodeGrant(
		openIdClientConfig,
		currentUrl,
		{
			pkceCodeVerifier: session.code_verifier,
			expectedState: session.state,
		},
		{
			client_id: clientConfig.client_id,
			client_secret: clientConfig.client_secret,
		},
	)

	await saveAuthTokens(tokenSet)

	await deleteCallbackSession()

	return Response.redirect(clientConfig.post_login_route)
}

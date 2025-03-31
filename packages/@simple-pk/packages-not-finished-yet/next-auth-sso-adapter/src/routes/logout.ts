import { buildEndSessionUrl } from 'openid-client'

import { clientConfig, deleteCookies, getClientConfig, getIdToken } from '@/lib/auth'

export async function GET() {
	const idToken = await getIdToken()
	const openIdClientConfig = await getClientConfig()

	const logoutParams: Record<string, string> = {
		post_logout_redirect_uri: clientConfig.post_logout_redirect_uri,
	}

	if (idToken) {
		logoutParams.id_token_hint = idToken
	}

	const endSessionUrl = buildEndSessionUrl(openIdClientConfig, logoutParams)

	// Delete the session cookie
	await deleteCookies()

	return Response.redirect(endSessionUrl.href)
}

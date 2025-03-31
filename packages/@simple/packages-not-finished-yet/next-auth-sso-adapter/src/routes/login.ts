import { buildAuthorizationUrl, calculatePKCECodeChallenge, randomPKCECodeVerifier, randomState } from 'openid-client'

import { getClientConfig } from '../client'
import { clientConfig } from '../config'
import { saveCallbackSession } from '../saveCallbackSession'

export async function GET() {
	const code_verifier = randomPKCECodeVerifier()
	const code_challenge = await calculatePKCECodeChallenge(code_verifier)
	const openIdClientConfig = await getClientConfig()
	const parameters: Record<string, string> = {
		redirect_uri: clientConfig.redirect_uri,
		scope: clientConfig.scope!,
		code_challenge,
		code_challenge_method: clientConfig.code_challenge_method,
	}

	let state!: string
	if (!openIdClientConfig.serverMetadata().supportsPKCE()) {
		state = randomState()
		parameters.state = state
	}
	const redirectTo = buildAuthorizationUrl(openIdClientConfig, parameters)

	await saveCallbackSession({ code_verifier, state })
	return Response.redirect(redirectTo.href)
}

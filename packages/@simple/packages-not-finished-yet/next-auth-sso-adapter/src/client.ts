import 'server-only'

import { discovery } from 'openid-client'

import { clientConfig } from './config'

export async function getClientConfig() {
	return await discovery(new URL(clientConfig.url), clientConfig.client_id)
}

// Config
export { clientConfig } from './config'
export type { AuthSession } from './config'

// Functions
export { getClientConfig } from './client'
export { deleteCallbackSession, deleteCookies } from './deleteSession'
export { getCallbackSession } from './getCallbackSession'
export { getAccessToken, getIdToken, getRefreshToken } from './getCookies'
export { createAuthMiddleware } from './middleware'
export { refreshAccessToken } from './refreshToken'
export { saveAuthTokens } from './saveAuthTokens'
export { saveCallbackSession } from './saveCallbackSession'
export { saveAccessToken, saveIdToken, saveRefreshToken } from './saveCookies'

// Routes

// we need to export the routes too
// individually if the user wants to manually put each of them and the method that allows to create all the auth routes with a single import

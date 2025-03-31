import { createCsrfMiddleware } from '@csrf/next'

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico|public|auth).*)'],
}

export default createCsrfMiddleware({
	cookie: {
		secure: process.env.NODE_ENV === 'production',
	},
})

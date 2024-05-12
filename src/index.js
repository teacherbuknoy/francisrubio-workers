import { accessTokenIsProvided, requestIsAuthenticated } from '../utils/auth'

export default {
	async fetch(request, env, ctx) {
		const authorization = request.headers.get('Authorization')
		console.log("Request is authorized:", await requestIsAuthenticated(authorization, env))

		if (!accessTokenIsProvided(request)) {
			return new Response(null, { status: 401 })
		}

		if (await requestIsAuthenticated(authorization, env)) {
			return new Response(null, { status: 202 });
		} else {
			return new Response(null, { status: 403 })
		}

	},
};

import { accessTokenIsProvided, requestIsAuthenticated, getTokenDetails, operationIsPermitted } from '../utils/auth'
import { getContent } from '../utils/request';

export default {
	async fetch(request, env, ctx) {
		const authorization = request.headers.get('Authorization')
		const token = await getTokenDetails(authorization)
		const content = await getContent(request)

		if (!accessTokenIsProvided(request)) {
			return new Response(null, { status: 401 })
		}

		if (!(await requestIsAuthenticated(token, env))) {
			return new Response(null, { status: 403 })
		}

		const hCardTypeExists = content.h != null
		if (!hCardTypeExists) {
			return new Response('No `h` parameter supplied.', { status: 400 })
		}

		if (!(await operationIsPermitted(content, token))) {
			return new Response(null, { status: 403 })
		}

		return new Response(null, { status: 201 });
	},
};

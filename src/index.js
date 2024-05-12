import { accessTokenIsProvided, requestIsAuthenticated, getTokenDetails, operationIsPermitted } from '../utils/auth'
import { getContent } from '../utils/request';
import { createGithubWriteRequest, createPostFile, parseItem } from '../utils/content';

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
			|| content.type === 'h-entry'
			|| content.type.includes('h-entry')
		if (!hCardTypeExists) {
			console.log(content)
			return new Response('No `h` parameter supplied.', { status: 400 })
		}

		if (!operationIsPermitted(content, token)) {
			console.log({ token, content })
			return new Response('Insufficient permissions: `create`.', { status: 403 })
		}

		const post = parseItem(content)
		const postfile = createPostFile(post)
		ctx.waitUntil(createGithubWriteRequest(postfile, post, env))
		return new Response(createPostFile(post), { status: 201, headers: { Location: 'https://francisrub.io/notes/' } });
	},
};

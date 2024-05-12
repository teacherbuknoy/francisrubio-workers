const ACCEPTED_CLIENT_IDS = [
	'https://quill.p3k.io/',
	'https://micropub.rocks/'
]

/**
 * @description Checks if the request has provided an access token
 * @author Francis Rubio
 * @export
 * @param {Request} request
 */
export function accessTokenIsProvided(request) {
	return request.headers.get('Authorization') != null
}

function domainsAreSame(u1, u2) {
	const url1 = new URL(u1)
	const url2 = new URL(u2)

	return url1.hostname === url2.hostname
}

function clientIsAccepted(clientId) {
	return ACCEPTED_CLIENT_IDS.find(id => domainsAreSame(clientId, id)) != null
}

/**
 * @description Retrieves token details based on the provided Authorization header
 * @author Francis Rubio
 * @param {string} authorization The authorization header
 * @returns {IndieToken}
 */
async function getTokenDetails(authorization) {
	const headers = {
		Authorization: authorization,
		Accept: 'application/json'
	}
	const response = await fetch('https://tokens.indieauth.com/token', { headers })
	return await response.json()
}

export async function requestIsAuthenticated(authorization, env) {
	const token = await getTokenDetails(authorization)

	if (token.error) {
		return false
	}

	console.log(token)

	const clientIsRecognized = clientIsAccepted(token.client_id)
	const meIsRecognized = domainsAreSame(token.me, env.ME_DOMAIN)

	console.log({ clientIsRecognized, meIsRecognized, me: env.ME_DOMAIN, token_me: token.me, token })
	return clientIsRecognized && meIsRecognized
}

/**
 * @typedef {Object} IndieToken
 * @property {string} me The ID of your own domain
 * @property {string} issued_by The issuer of this token
 * @property {string} client_id The client that sent this request
 * @property {number} issued_at The timestamp at which this token was issued
 * @property {string} scope A space-separated string of permissions for this token
 * @property {number} nonce
 */

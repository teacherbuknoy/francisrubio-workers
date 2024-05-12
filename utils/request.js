import queryString from "query-string"

/**
 * @description Returns the request body appropriate to its Content-Type header
 * @author Francis Rubio
 * @export
 * @param {Request} request
 * @returns {*}
 */
export async function getContent(request) {
	const contentType = request.headers.get("Content-Type")

	if (contentType.includes('application/json')) {
		return await request.json()
	} else if (contentType.includes('application/text')) {
		return await request.text()
	} else if (contentType.includes('text/html')) {
		return request.text()
	} else if (contentType.includes('form')) {
		return queryString.parse(await request.text(), { arrayFormat: 'bracket' })
	} else {
		return await request.body
	}
}

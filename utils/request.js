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
		const form = await request.formData()
		const body = {}
		for (const entry of form.entries()) {
			body[entry[0]] = entry[1]
		}

		return body
	} else {
		return await request.body
	}
}

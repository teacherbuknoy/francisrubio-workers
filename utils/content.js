import { Octokit } from "octokit"
import YAML from 'yaml'
import slugify from "slugify"

function encodeBase64(str) {
	const encoder = new TextEncoder()
	const encoded = encoder.encode(str)

	const binaryString = encoded.reduce((acc, byte) => {
		return acc + String.fromCharCode(byte)
	}, '')

	return btoa(binaryString)
}

/**
 * @description Creates a post file for committing to github
 * @author Francis Rubio
 * @param {MicropubItem} item
 */
export function createPostFile(item) {
	const frontmatter = {
		title: item.name,
		tags: item.tags
	}
	const yaml = YAML.stringify(frontmatter)
	const fileContents = `---\n${yaml}\n---\n\n${item.content}`
	const pubDate = new Date().toISOString().split('T')[0]
	const slugConfig = { lower: true, strict: true, locale: 'en' }
	const filename = `${pubDate}-${slugify(frontmatter.title, slugConfig)}.md`

	return { filename, contents: fileContents }
}

/**
 * @description Parses a post item
 * @author Francis Rubio
 * @export
 * @param {MicropubItem} item
 * @returns {MicropubItem}
 */
export function parseItem(item) {
	if (item.h === 'entry') { return JSON.stringify(item) }

	if (item.type === 'h-entry' || item.type.includes('h-entry')) {
		const entry = item.properties
		const content = {
			name: Array.isArray(entry.name)
				? entry.name[0]
				: entry.name,
			content: entry.content[0].html,
			tags: entry.category
		}

		return content
	}

	return null
}

/**
 * @description Creates a write request for Github
 * @author Francis Rubio
 * @param {string} file
 * @param {MicropubItem} item
 * @param {*} env
 */
export async function createGithubWriteRequest(file, item, env) {
	const octokit = new Octokit({ auth: env.GI_ACCESS })
	return octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
		owner: 'teacherbuknoy',
		repo: 'francisrubio',
		path: 'src/collections/notes/' + file.filename,
		message: 'Publish note from Quill: ' + item.name,
		committer: {
			name: 'Francis Rubio',
			email: '96061229+teacherbuknoy@users.noreply.github.com'
		},
		content: encodeBase64(file.contents),
		headers: {
			accept: 'application/vnd.github+json',
			authorization: env.GI_ACCESS
		}
	})
}

/**
 * @typedef {Object} MicropubItem
 * @property {string} type The type of content this item is
 * @property {string} name The title of the post
 * @property {string} content The content of this item
 * @property {string[]} tags The tags for this item
 * @property {string|URL} inReplyTo The URL of a post this item replies to
 * @property {string|URL} location the GEO URI of this item
 * @property {string|URL|File} photo The photo that is attached to this item
 * @property {string} slug The slug for this post
 * @property {Syndication[]} syndicateTo The endpoints to which this item should be syndicated to
 */

/**
 * @typedef {Object} Syndication
 * @property {string} name The name of this syndication endpoint
 * @property {string|URL} uid The URL of this syndication endpoint
 */

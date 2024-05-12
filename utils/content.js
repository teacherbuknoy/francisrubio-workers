export function parseItem(item) {
	console.log(item)
}

/**
 * @typedef {Object} MicropubItem
 * @property {string} type The type of content this item is
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

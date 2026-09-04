export function buildRequestUrl(host, cmd, query = {}) {
	const url = new URL(`http://${host}:8080/${cmd}`)
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined && value !== null) {
			url.searchParams.set(key, String(value))
		}
	}
	return url.toString()
}

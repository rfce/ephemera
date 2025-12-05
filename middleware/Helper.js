const fspromises = require("fs").promises
const mime = require("mime-types")

// Downloads base64 encoded image/file to file system
// Returns file path
const fileDownloader = async (filename, encoded) => {
	const parts = encoded.match(/^data:(.+);base64,(.+)/)

	if (parts === null) {
		return false
	}

	const [__encoded, contentType, data] = parts

	const extension = mime.extension(contentType)

	const file = filename ? filename + "." + extension : uuid() + "." + extension

	const storage = `./uploads/${file}`

	await fspromises.writeFile(
		storage,
		data,
		"base64"
	)

	return storage
}

module.exports = {
    fileDownloader
}

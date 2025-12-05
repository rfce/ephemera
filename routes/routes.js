const expres = require("express")
const router = expres.Router()

const Author = require("../controllers/Author")

router.get("/info", Author.info)
router.post("/Image/upload", Author.uploadImage)

module.exports = router

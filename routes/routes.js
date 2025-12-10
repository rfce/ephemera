const expres = require("express")
const router = expres.Router()

const Author = require("../controllers/Author")

router.get("/keep-alive", Author.keepAlive)
router.post("/Image/upload", Author.uploadImage)
router.get("/Image/:id", Author.fetchImage)
router.get("/Message/active", Author.activeMessage)

module.exports = router

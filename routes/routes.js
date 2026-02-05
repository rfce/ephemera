const expres = require("express")
const router = expres.Router()

const Author = require("../controllers/Author")
const Message = require("../controllers/Message")
const { Authentication } = require("../middleware/Authentication")

router.get("/keep-alive", Author.keepAlive)
router.post("/Auth/sign-in", Author.loginUser)
router.post("/Auth/register", Author.registerUser)
router.post("/Image/upload", Author.uploadImage)
router.get("/Image/:id", Author.fetchImage)
router.get("/Message/active", Author.activeMessage)

router.post("/Message/create-recipient", Authentication, Message.createRecipient)
router.post("/Message/fetch-recipient", Authentication, Message.fetchRecipients)

module.exports = router

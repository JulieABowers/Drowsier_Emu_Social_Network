const router = require("express").Router();

const {

} = require("../../controllers/thoughtController");

// `GET` to get all thoughts
router.route("/")

// `GET` to get a single thought by its `_id`

// `POST` to create a new thought (don't forget to push the created thought's `_id` to the associated user's `thoughts` array field)

module.exports = router;
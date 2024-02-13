const router = require("express").Router();

const {
    getThoughts,
    createThought,
    getThoughtById,
    deleteThought,
    updateThought,
    addReaction,
    removeReaction
} = require("../../controllers/thoughtController");

// `GET` to get all thoughts. `POST` to create a new thought (don't forget to push the created thought's `_id` to the associated user's `thoughts` array field)
router.route("/").get(getThoughts).post(createThought);

// `GET` to get a single thought by its `_id`
router
    .route("/:thoughtId")
    .get(getThoughtById)
    .delete(deleteThought)
    .put(updateThought);

// `POST` to create a reaction stored in a single thought's `reactions` array field
router.route("/:thoughtId/reactions").post(addReaction);

// `DELETE` to pull and remove a reaction by the reaction's `reactionId` value
router.route("/:thoughtId/reactions/:reactionId").delete(removeReaction);








module.exports = router;
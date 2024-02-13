const router = require("express").Router();

const {
    getUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend,
} = require('../../controllers/userController');

// `GET` all users
router.route('/').get(getUsers).post(createUser);

// `GET` a single user by its `_id` and populated thought and friend data
router.route('/:userId').get(getSingleUser).put(updateUser).delete(deleteUser);

// `POST` a new user:
router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

module.exports = router;




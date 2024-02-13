const { User, Thought } = require('../models');

module.exports = {
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json(err)
        }
    },

    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
                // .populate({ path: 'friends',  select: '-__v' })
                // .populate({ path: 'thoughts',  select: '-__v'});

            if (!user) {
            return res.status(404).json({ message: 'No user with this id!' });
            }

            res.json(user);
        } catch (err) {
            console.error(err);
            res.status(400).json(err);
        }
    },

    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async updateUser(req, res) {
        try {
            const { username, email, thoughts, friends } = req.body;
            const update = {};
            if (username) update.username = username;
            if (email) update.email = email;
            if (thoughts) update.thoughts = thoughts;
            if (friends) update.friends = friends;
            const updatedUser = await User.findByIdAndUpdate(
                req.params.userId,
                update,
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.json(updatedUser);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({
                _id: req.params.userId,
            });

            if (!user) {
                return res.status(404).json({ message: 'No user with this id!' });
            }

            res.json(user);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async addFriend(req, res) {
        try {
            const friend = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                {runValidators: true, new: true}
            );

            if (!friend) {
                return res.status(404).json({ message: 'No user found with that id!' });
            }
            res.json(friend);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async removeFriend(req, res) {
        try {
            const friend = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );

            if (!friend)
            {
                return res.status(404).json({ message: 'No user found with that id!' });
            }
            res.json(friend);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};
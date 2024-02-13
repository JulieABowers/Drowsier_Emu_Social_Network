const { User, Thought } = require('../models');
const noThoughtFound = 'No thought with this id!';

module.exports = {
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            const thoughtObj = {
                thoughts,
                thoughtCount: await totalThoughts(),
            };
            res.json(thoughtObj);
        } catch (err) {
            res.status(500).json(err)
        }
    },

    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);

            const updatedUser = await User.findOneAndUpdate(
                { username: req.body.username },
                { $addToSet: { thoughts: thought._id } },
                { runValidators: true, new: true }
            );

            if (!updatedUser) {
                await Thought.deleteOne({ _id: thought._id });
                return res.status(404).json({ message: 'User not found. Thought creation failed.' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async getThoughtById({ params }, res) {
        try {
            const thought = await Thought.findOne({ _id: params.id })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v');

            if (!thought) {
                return res.status(404).json({ message: noThoughtFound });
            }
            
            res.json(dbThoughtData);
        } catch (err) {
            console.error(err);
            res.sendStatus(400);
        }
    },

    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({
                _id: req.params.thoughtId,
            });

            if (!thought) {
                return res.status(404).json({ message: noThoughtFound });
            }

            const user = await User.findOneAndUpdate(
                { username: thought.username },
                { $pull: { thoughts: req.params.thoughtId } },
                { runValidators: true, new: true }
            );

            if (!user) {
                return res
                .status(404)
                .json({ message: 'No user found with that id.' });
            }

            res.json({ message: 'Thought has been successfully deleted.' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    async updateThought(req, res) {
        try {
            const { params, body } = req;
            console.log(params.thoughtId);
            console.log(body);
        
            const thought = await Thought.findOneAndUpdate(
                { _id: params.thoughtId },
                body,
                { new: true, runValidators: true }
            );
        
            if (!thought) {
                return res.status(404).json({ message: noThoughtFound });
            }

            res.json(thought);
        } catch (err) {
            console.error(err);
            res.status(400).json(err);
        }
    },


    async addReaction(req, res) {
        try {
            console.log(req.body);
            const reaction = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
            );

            if (!reaction) {
                return res
                    .status(404)
                    .json({ message: noThoughtFound });
            }
            res.json(reaction);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async removeReaction(req, res) {
        try {
            const reaction = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { _id: req.params.reactionId } } },
                { runValidators: true, new: true }
            );

            if (!reaction) {
                return res
                    .status(404)
                    .json({ message: 'No reaction with this id.' });
            }
            res.json(reaction);
        } catch (err) {
            res.status(500).json(err);
        }
    },

};
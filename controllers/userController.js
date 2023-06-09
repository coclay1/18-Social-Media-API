const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
    getUsers(req, res) {
        User.find()
            .then(async (users) => {
                const userObj = {
                    users,
                };
                return res.json(userObj);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err)
            })
    },
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.id })
            .populate('thoughts')
            .then(async (user) =>
                !user
                    ? res.status(404).json({ message: 'No User Found!' })
                    : res.json({
                        user,
                    }))
                        .catch((err) => {
                            console.log(err);
                            return res.status(500).json(err)
                        });
    },
    newUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err))
    },
    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.id })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: "No User Found" })
                    : Thought.deleteMany({_id: { $in: user.thoughts }}))
            .then(() => res.json({ message: "Delete Successful!" }))
            .catch((err) => {
                console.log(err);
                res.status(500).json(err)
            });
    },
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No User Found' })
                    : res.json(user))
            .catch((err) => res.status(500).json(err));
    },
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.id },
            { $addToSet: { friends: req.body.id } })
                .then((user) =>
                    !user
                        ? res.status(404).json({ message: 'No User Found' })
                        : res.json(user))
                .catch((err) => res.status(500).json(err))
        ;
    },
    removeFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.id },
            { $pull: { friends: req.params.friendId } }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No User Found' })
                    : res.json(user))
            .catch((err) => res.status(500).json(err))
            ;
    }
};


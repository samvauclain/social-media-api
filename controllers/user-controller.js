const { User, Thought } = require('../models');

const userController = {

    // getting all users
     getAllUsers(req, res) {
        User.find({})
            .select('-__v')
            .populate({
                path:'thoughts',
                select: '-__v'
            })
            .then(dbUser => res.json(dbUser))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            })
    },

    // getting user by id
    getUserById({ params }, res) {
        console.log(params)
        User.findOne({ _id: params.id })
            .populate({
                path:'thoughts',
                select: '-__v'
            })
            .then(dbUser => {
                if(!dbUser) {
                    res.status(404).json({ message: 'No user found with this id'})
                    return;
                }
                res.json(dbUser);
            })
            .catch(err => {
                console.log(err)
                res.status(400).json(err);
            });
    },

    // create a new user
    createUser({ body }, res) {
        User.create(body)
        .then(dbUser => res.json(dbUser))
        .catch(err => res.json(err))
    },

    // Update a user
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { runValidators: true, new: true })
            .then(dbUser => {
                if (!dbUser) {
                    res.status(404).json({ message: 'No User found with this id!' })
                    return;
                }
                res.json(dbUser);
            })
            
            .catch(err => res.json(err));
    },

     // delete user
     deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(dbUser => {
            if(!dbUser) {
                res.status(404).json({ message: 'No user found with this id'})
                return;
            }

            res.json(dbUser);        

        })

     .catch(err => res.json(err))

    },

    // create new friend
    createFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId }, 
            { $push: 
                { friends: params.friendId } 
            }, 
            { new: true }
            ).then(dbUser => {
                if (!dbUser) {
                    res.status(404).json({ message: 'No friend found with this id' })
                    return
                }
                res.json(dbUser);
            })

        .catch(err => res.json(err));
    },

    // delete friend
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: 
                { friends: params.friendId }
            },
            { runValidators:true, new: true }
        )
        .then(dbUser => {
            if(!dbUser) {
                res.status(404).json({ message:'No user found with this id' })
                return;
            }
            res.json(dbUser);
        })
        
        .catch(err => res.json(err));
    }

}

module.exports = userController;
const { Thought, User } = require('../models')

// add a thought
const thoughtController  = {
    getAllThoughts(req, res) {
    console.log(req);
    Thought.find({}).then(dbThoughts => res.json(dbThoughts))
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    })
},

    // get a thought by ID
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.thoughtId })
            .then(dbThoughts => res.json(dbThoughts))
            .catch(err => {
                console.log(err)
                res.status(404).json({ message: 'No thought found with this id'} )
            })
    },

    // create a new thought
    createThought({ params, body }, res) {
        Thought.create(body).then(({_id }) => {
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $push: { thoughts: _id }},
                    { new: true}
                );
            })
            .then(dbThoughts => {
                if (!dbThoughts) {
                    res.status(404).json({ message: 'No user found with this id'} )
                    return;
                }
                res.json(dbThoughts);
            })
            .catch(err => res.json(err));
    },

    // update existing thought
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({_id:params.thoughtId}, body, {new:true, runValidators: true})
        .then(dbThoughts => {
            if(!dbThoughts) {
                res.status(404).json({message: 'No thought found with this id'})
                return;
            }
            res.json(dbThoughts);
        })
        .catch(err => res.status(err));
    },

    // delete a thought
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({_id: params.thoughtId})
        .then(dbThoughts => {
            if (!dbThoughts) {
                res.status(404).json({message:'No thought found with this id'})
                return;
            }
            res.json(dbThoughts);
        })
        .catch(err => res.status(err));
    },

    // react to a thought
    createReaction({ params, body }, res ) {
        Thought.findOneAndUpdate(
            
            {_id: params.thoughtId},
            { $push: {reactions: body}},
            {new: true, runValidators:true}
        )
        .then(dbThoughts => {
            if(!dbThoughts) {
                res.status(404).json({message: 'No reaction found with this id'})
                return;
            }
            res.json(dbThoughts);
        })
        .catch(err => res.json(err));
    },

    // delete reaction
    deleteReaction({ params }, res ) {
        Thought.findOneAndUpdate(            
            {_id: params.thoughtId},
            { $pull: {reactions: 
                { reactionId: params.reactionId }
            }},
            {new: true, runValidators:true}
        )
        .then(dbThoughts => {
            if(!dbThoughts) {
                res.status(404).json({message: 'No reaction found with this id'})
                return;
            }
            res.json(dbThoughts);
        })
        .catch(err => res.json(err));
    }  

}

module.exports = thoughtController;
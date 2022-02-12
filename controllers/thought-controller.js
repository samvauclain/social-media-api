const { Thought, User } = require('../models')

// add a thought
const thoughtController  = {
    getAllThoughts(req, res) {
    console.log(req);
    Thought.find({}).then(dbThoughts => res.json(dbThoughts))
    .catch(err => {
        console.log(err)
        res.sendStatus(400)
    })
},

    // get a single thought by ID
    getThoughtByID({ params }, res) {
        console.log(params)
        Thought.findOne({_id:params.thoughtId})
        .then(dbThoughts => {
            if(!dbThoughts) {
                res.status(404).json({ message: 'No thought found with this id!'})
                return;
            }
            res.json(dbThoughts)
        })        
        .catch(err => {
            console.log(err)
            res.status(400).json(err);

        });
    },

    createThought({ params, body }, res) {
        Thought.create(body).then(({_id }) => {
                return User.findOneAndUpdate(
                    {_id: params.userId},
                    { $push: { thoughts: _id }},
                    { new: true}
                );
            })
            .then(dbThoughts => {
                if (!dbThoughts) {
                    res.status(404).json({message: 'No user found with this id'})
                    return;
                }
                res.json(dbThoughts)
            })
            .catch(err => res.json(err))
    },

}
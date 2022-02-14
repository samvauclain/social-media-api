const mongoose = require('mongoose');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('./routes'));
// don't think I need this, may not do a public folder - app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/social-media', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// mongoose.connect('mongodb://localhost:27017/social-media',function(){
//     /* Drop the DB */
//     mongoose.connection.db.dropDatabase();
// });

mongoose.set('debug', true);

app.listen(PORT, () => console.log(`Connected to server on localhost:${PORT}`));
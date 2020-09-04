const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://root:Zuzu5261245@cluster0-1tvg3.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(db => console.log('db connected'))
    .catch(err => console.log(err));

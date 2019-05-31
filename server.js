if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var methodOverride = require('method-override')

// Routers connection
const indexRouter = require('./routes/index');
const directorsRouter = require('./routes/directors');
const moviesRouter = require('./routes/movies');

const port = process.env.PORT || 3000; 

// view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(methodOverride('_method'))
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

// Connection to the DB
mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser: true
});
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));

app.use('/', indexRouter);
app.use('/directors', directorsRouter);
app.use('/movies', moviesRouter);

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});
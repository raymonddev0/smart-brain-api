const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require ('cors');
const knex = require ('knex');

require ('dotenv').config();

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'test',
    database : 'postgres'
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res)=> {res.send('it is working!')})
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res)=>{register.handleRegister(req, res, db, bcrypt)}) 
app.get('/profile/:id', (req, res)=>{profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res)=>(image.handleImage(req, res, db)))
app.post('/imageurl', (req, res)=>(image.handleApiCall(req, res)))

app.listen (process.env.PORT || 3333, () => {
	console.log(`app is running on port ${process.env.PORT}`);
})

/*this are the endpoints that we expect
/--> res = this is working
/signin --> POST = success/fail so as to hide in the body, prevent man in the middle in GET
/register --> POST = user
/profile/:userID --> GET = user
/image --> PUT --> user
*/
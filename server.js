require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require ('cors');
const knex = require ('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const isDev = (process.env.NODE_ENV === 'dev');

const db = knex({
  client: 'pg',
  connection: {
  	host: !isDev ? process.env.PG_HOST : '127.0.0.1',
  	user: !isDev ? process.env.PG_USER : '',
  	password: !isDev ? process.env.PG_PASSWORD : '',
  	database: !isDev ? process.env.PG_DATABASE : 'smart-brain',
    //connectionString : process.env.DATABASE_URL,
   	ssl: !isDev ? true : false
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
	console.log(`app is runnnnning on port ${process.env.PORT}`)
	console.log(`app is runnnnning on port ${process.env.NODE_ENV}` mode)
})

/*this are the endpoints that we expect
/--> res = this is working
/signin --> POST = success/fail so as to hide in the body, prevent man in the middle in GET
/register --> POST = user
/profile/:userID --> GET = user
/image --> PUT --> user
*/
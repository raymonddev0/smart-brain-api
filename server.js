const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require ('cors');
const knex = require ('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    connectionString : postgres://woulzyilbbozph:ca9aaa23f9c1512eaad138a7ac25e42e89f2a46ff3c2b7ccf5edf76b3d5c1eb6@ec2-54-83-8-246.compute-1.amazonaws.com:5432/d1dcm9p9ennrht,
   	ssl: true;
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
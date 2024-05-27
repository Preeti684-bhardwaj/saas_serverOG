require('dotenv').config()

const express = require('express');

let bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');

const passport = require('passport');
const passportJWT = require('passport-jwt');

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_SECRET;
jwtOptions.passReqToCallback= true;

const db = require('./app/config/db.config.js');

let strategy = new JwtStrategy(jwtOptions, function(req,jwt_payload, done) {
  //console.log('payload received', jwt_payload);
  var Model = jwt_payload.obj.type === 'CUSTOMER' ? db.customers : db.admins;

   
  Model.findOne({where: {id: jwt_payload.obj.obj.id}})
	  .then( user =>{
        if (user) {
	   let obj ={
		   type:jwt_payload.obj.type,
		   obj:user
	   };
           return done(null,obj);
        } else {
            return done(null, false);
        }
    }).catch( error =>{
	    return done(null, false);
    });

});

// use the strategy
passport.use('jwt',strategy);


  
// force: true will drop the table if it already exists
// db.sequelize()
// .then(()=>{
//   console.log("database connected successfully")
// })
db.sequelize.sync().then(() => {
 console.log('Drop and Resync with { force: true }');
}); 

let router = require('./app/routers/index.js');

const cors = require('cors')

let cluster = require('express-cluster');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = {
definition:{ 
  openapi: '3.0.0',
  info: {
      title: 'Saas Subscription Documentation',
      version: '1.0.0',
      description: 'Your API description',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'JSONPlaceholder',
      url: 'https://jsonplaceholder.typicode.com',
    },
  },
  servers: [
    {
      url: 'https://stream.xircular.io',
      description: 'Development server',
    },
  ],
  },
  apis: ['./app/routers/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);


cluster(function(worker) {
	const app = express();
	app.set('views', './app/views');
	app.set('view engine', 'ejs');
	app.use(cors());

	app.use(bodyParser.json());
	app.use('/', router);
	app.use(passport.initialize());
	
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

	const server = app.listen(19901, function () {
  		let host = server.address().address
  		let port = server.address().port
 
  		console.log("Workder listening at http://%s:%s", host, port); 
	})
}, {count: 4});


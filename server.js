const express = require('express')
const app = express();
const path = require('path')
const bodyParser = require('body-parser');
const cors = require('cors')
const api = {
    mySqlRoute : require('./api/sqlRoute').route,
    sequelizeRoute : require('./api/sequelizeRoute').route,
    mongoDbRoute : require('./api/mongoDbRoute').route
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors());

app.use(express.static(path.join(__dirname,'public_static')));

app.use('/mysql', api.mySqlRoute);
app.use('/sequelize',api.sequelizeRoute)
app.use('/mongoDb',api.mongoDbRoute)

app.listen('2211',()=>{
    console.log('Server is listening at http://localhost:2211');
})
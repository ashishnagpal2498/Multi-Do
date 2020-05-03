const express = require('express')
const app = express();
const path = require('path')
const bodyParser = require('body-parser');
const api = {
    mySqlRoute : require('./api/sqlRoute').route
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname,'public_static')));

app.use('/mysql', api.mySqlRoute);


app.listen('2211',()=>{
    console.log('Server is listening at http://localhost:2211');
})
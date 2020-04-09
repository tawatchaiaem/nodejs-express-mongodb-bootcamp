
const dotenv = require('dotenv');
//dotenv.config({path: '.env'});


console.log(dotenv.config({path: './.env'}));
console.log(process.env.NODE_ENV);
console.log(process.env);
const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
const express = require("express")

const app = express()

app.use(require('cors')())
app.use(express.json())

require('./router/web')(app)

app.listen(8002, () => {
  console.log('http://localhost:8002');
});
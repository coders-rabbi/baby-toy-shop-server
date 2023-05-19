const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;




app.get('/', (req, res) => {
    res.send('baby-shop is running')
})


app.listen(port, () => {
    console.log(`baby-shop  Server is running on port ${port}`);
})
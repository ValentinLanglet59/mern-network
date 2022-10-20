const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

connectDB();

app.use(express.json({ extended: false }));
app.use(cors({ origin: 'http://localhost:3000' }));

app.get('/', (req, res, next) => {
  res.send('hello');
});

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});

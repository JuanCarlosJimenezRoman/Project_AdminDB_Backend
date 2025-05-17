const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const userRoutes = require('./routes/userRoutes');
require ('dotenv').config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/', userRoutes);

//test DB connection
sequelize.authenticate()
.then(() => {
    console.log('Database connected successfully');
    return sequelize.sync();
})
.then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
});

//Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

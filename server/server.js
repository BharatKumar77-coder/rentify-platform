require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const cors = require('cors');
const PORT = process.env.PORT || 5000;

app.use(cors());
// Connect to DB then start server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
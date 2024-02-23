const { default: mongoose } = require("mongoose");

const connectDB = () => {
  try {
    mongoose.connect(`${process.env.DB_URI}`);
    console.log(`[mongodb] db is connected`);
  } catch (err) {
    let connectionCount = 2;

    const reConnect = async () => {
      try {
        mongoose.connect(`${process.env.DB_URI}`);
        console.log(`[mongodb] db is connected`);
        clearInterval(reConnectId);
      } catch (err) {
        if (connectionCount > 0) {
          console.log(`[mongodb] reconnecting...(${connectionCount})`);
          connectionCount--;
        } else {
          console.error("Error", err);
          clearInterval(reConnectId);
        }
      }
    };

    const reConnectId = setInterval(reConnect, 2000);
  }
};

module.exports = connectDB;
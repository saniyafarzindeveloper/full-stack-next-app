//this file is used to check DB connection.
//the already existing/established connection is checked to avaoid DB choking

import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

//checking connection status
async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to DB");
    return;
  }

  //if no connection exists --> create a new conection
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {})
    connection.isConnected = db.connections[0].readyState;
    console.log('DB connected successfully!')
  } catch (error) {
    console.log('DB connection failed!', error)
    process.exit(1);
  }
}

export default dbConnect;

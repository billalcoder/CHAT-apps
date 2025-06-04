import mongoose from "mongoose";

export const mongoUrl = await mongoose.connect("mongodb://admin:admin@localhost:27017/ChatApp?replicaSet=myrepname&authSource=admin")

console.log("database connected");
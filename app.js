import "./db/db.js"
import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import multer from "multer"
import { PrivateMessage } from "./model/privateMessageModel.js"
import { User } from "./model/userModel.js"
import cookieParser from "cookie-parser"
import crypto from "crypto"
import { startSession } from "mongoose"
import path from "path"
import { async } from "@parcel/utils"

const app = express()


app.use(cors({
    origin: "http://localhost:5500",
    credentials: true
}))
const secretKey = "mySecretKeybybillal"
app.use(cookieParser(secretKey))
app.use(express.json())

const filePath = "C:\\Users\\Dell\\OneDrive\\Desktop\\mainChatApp\\public"
app.use(express.static(filePath))
const httpserver = createServer(app)

const io = new Server(httpserver)


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public'); // folder must exist
    },
    filename: function (req, file, cb) {
        const name = file.originalname
        cb(null, name); // you can make this dynamic
    }
});


const upload = multer({ storage });

app.post("/register", upload.single("file") , async (req, res) => {
    const { name, email, password, bio } = req.body
    console.log(bio);
    const file = req.file.originalname
const message = ""
    if (name && email && password && bio) {
        const passHash = crypto.createHash("sha256").update(password).digest("hex")
        try {
           const session = startSession()
           await session.startTransaction
            await User.insertOne({
                name,
                email,
                password: passHash,
                bio,
                file 
            })
                const user = await User.findOne({email})

            await PrivateMessage.insertOne({
                name,
                sender: user._id,
                reciver : null ,
                message 
            }) 
     
            res.status(200).send({ message: "Data Inserted" })
            await session.commitTransaction
        } catch (err) {
            console.log(err);
            res.status(500).send({ error: "Internal server error" })
        }
    } else {
     return res.send({ error: "field is missing" })
    }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body

    console.log(req.body);
    const passHash = crypto.createHash("sha256").update(password).digest("hex")
    try {
        const userEmail = await User.findOne({ email })

        if (userEmail.password === passHash) {
            res.cookie("Token", userEmail._id, {
                signed: true
            })

            res.status(200).send({ message: "successfully login" })
        } else {
            res.status(404).send({ error: "Unauthorized access" })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Internal server error" })
    }
})

app.get("/people" , async (req, res) => {
    const user = await User.find().select("name friendRequestList friendList bio file").lean()

    const updatedUsers = user.map(user => {
    return {
      ...user,
      fileUrl: `http://localhost:1000/${user.file}`  // Adjust base URL if needed
    };
  });
    res.send(updatedUsers)
})

app.post("/request",async (req ,res)=>{
    const {id} = req.body
    const user = await User.findOne({_id : id})
    console.log(user);
    res.send({message : "hi"}) 
})

io.on("connection", (socket) => {
    console.log(socket.id); 
})

httpserver.listen(1000, () => {
    console.log("server connected");
})
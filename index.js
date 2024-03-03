import express from "express";
import { Server } from "socket.io";
import { createServer } from "http"
import cors from "cors"
const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "https://patric-chat.vercel.app",
        methods: ["GET", "POST"],
        credentials: true
    }
})
app.get("/", (req, res) => {
    res.send("home")
})

app.use(cors({
    origin: "https://patric-chat.vercel.app",
    methods: ["GET", "POST"],
    credentials: true
}))
let sockets = []
io.on("connection", (socket) => { //server create // here connection is an event on this event a callback is executed 
//    console.log(socket.id);
    socket.on("usersent" , (username)=>{
        sockets[socket.id]=username
        socket.emit("welcome" , `Welcome to the chat , ${username}`)
        socket.broadcast.emit("otheruserhasjoined" , `${username} has just joined the chat`)
    })
    socket.on("message", (data) => {
        io.emit("recieve-message", { msg: data.msg, id: socket.id, name: data.name })
    })
    socket.on("disconnect", () => {
        socket.broadcast.emit("disconnect-message", `${sockets[socket.id]} left the chat`)
    })
})
server.listen(5000, () => {
    console.log("Server started on port 5000");
})
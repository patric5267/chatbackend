import express from "express";
import { Server } from "socket.io";
import { createServer } from "http"
import cors from "cors"
const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
})
app.get("/", (req, res) => {
    res.send("home")
})

app.use(cors({
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST"],
    credentials: true
}))
let sockets = []
io.on("connection", (socket) => { //server create // here connection is an event on this event a callback is executed 
    socket.on("usersent", (user) => {
        sockets[socket.id] = user
        socket.emit("welcome", `Welcome to the chat ${user}`)
        socket.broadcast.emit("userjoined", `${user} has joined the chat`)
    })
    socket.on("message", (data) => {
        io.emit("recieve-message", { msg: data.msg, id: socket.id, name: data.name , img:data.img})
    })
    socket.on("disconnect", () => {
        socket.broadcast.emit("disconnect-message", `${sockets[socket.id]} left the chat`)
    })

})
server.listen(5000, () => {
    console.log("Server started on port 5000");
})
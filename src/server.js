import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app); 
const io = new Server(server);

app.use(express.static('public'));

server.listen(process.env.PORT);  

let connectedUsers = [];

io.on('connection', (socket) => {


    socket.on('join-request', (username) => {
       
        socket.username = username;
        connectedUsers.push(username);

        socket.emit('user-ok', connectedUsers);
        socket.broadcast.emit('list-update', {
            joined: username,
            list: connectedUsers
        });
    });


    socket.on('disconnect', () => {
    
        connectedUsers = connectedUsers.filter(username => username != socket.username);

        socket.broadcast.emit('list-update', {
            left: socket.username,
            list: connectedUsers
        });
    });


    socket.on('send-msg', (txt) => {

        let obj = {
            username: socket.username,
            msg: txt
        }

        socket.emit('show-msg', obj);

        socket.broadcast.emit('show-msg', obj);
    });


});


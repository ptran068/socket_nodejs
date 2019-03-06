import express from 'express';
import bodyParser from 'body-parser';
import index from './app/router/index';
import mongoose from'mongoose';
import config from './app/config/development';
import path from 'path';
const PORT = process.env.PORT || 3000;
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//socket
let arrUser = [];
io.on('connection', function(socket){
	console.log(`a user connected ${socket.id}`);

	socket.on("client-send-username", function(data) {
		if (arrUser.indexOf(data) >= 0) {
			socket.emit("server-send-dk-thatbai")
		} else {
			arrUser.push(data);
			//tao user name
			socket.Username = data;
			socket.emit("server-send-dk-thanhcong", data);
			io.sockets.emit("server-send-danhsach", arrUser);
		}
	});

	socket.on("logout", function() {
		arrUser.splice(
			arrUser.indexOf(socket.Username), 1
		);
		socket.broadcast.emit("server-send-danhsach", arrUser);
	});

	socket.on("user-send-message", function(data) {
		io.sockets.emit("server-send-message", {us: socket.Username, nd: data});
	});

	socket.on("typing", function() {
		const a = socket.Username + "is typing";
		io.sockets.emit("someone-typing", a);
	});

	socket.on("stoptyping", function() {
		console.log(socket.Username + "is stop typing");
	});
	

	
	socket.on('disconnect', function(){
		console.log(`${socket.id} user disconnected`);
		});
		
  });
 
 
  //
mongoose.connect(config.db, { useNewUrlParser: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(index);


http.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});
module.exports = app;
const SocketIO = require('socket.io');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cookie = require('cookie-signature');

module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { path: '/socket.io' });
  app.set('io', io);
  const comment = io.of('/comment');
  

  io.use((socket, next) => {
    cookieParser(process.env.COOKIE_SECRET)(socket.request, socket.request.res, next);
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  comment.on('connection', (socket) => {
    console.log('room 네임스페이스에 접속');
    var viewId = "";
    socket.on('join',(data) =>{
        console.log(data);
        viewId=`${data.bo_id}/${data.id}`;
        socket.join(viewId);
        console.log(viewId);
    });
    //해당 게시판에 댓글이 올라가도록
    socket.on('list',(data) => {  
      console.log(data);
      socket.to(viewId).emit(data);

    })
    socket.on('disconnect', () => {
      console.log('room 네임스페이스 접속 해제');
      socket.leave(viewId);
    });
  });

  
};
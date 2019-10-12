require('./removeByValue')()

module.exports = function (io) {
  console.log("소켓 접속")
  var userList = []; //사용자 리스트를 저장할곳
  io.on('connection', function (socket) {

    //아래 두줄로 passport의 req.user의 데이터에 접근한다.
    var session = socket.request.session.passport;
    var user
    if(session === undefined || Object.keys(session).length === 0){
      var num = Math.floor(Math.random() * 100) + 1;
      user = {displayname:''}
      user.displayname = 'guest'+num
    }else{
      user = (typeof session !== 'undefined') ? (session.user) : "";
    }

    // userList 필드에 사용자 명이 존재 하지 않으면 삽입
    // 일치하는배열의 인덱스값을 반환
    if (userList.indexOf(user.displayname) === -1) {
      userList.push(user.displayname);
    }

    io.emit('join', userList);
    
    socket.on('client message', function (data) {
      io.emit('server message', { message : data.message , displayname : user.displayname });
    })

    socket.on('disconnect', function () {
      userList.removeByValue(user.displayname);
      io.emit('leave', userList);
      io.emit('leaveUser', user.displayname);
    });

  })
}
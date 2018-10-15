const express = require('express'),
http = require('http'),
app = express(),
server = http.createServer(app),
mongoClient = require('mongodb').MongoClient,
io = require('socket.io').listen(server);

var url = "mongodb://127.0.0.1:27017/";

const generateString = (stringLength) => {
  const randomstring = require('randomstring')
  const s = new Set()
  s.add(randomstring.generate(stringLength))
  return s
}

const chatID = generateString(10)

app.get('/', (req, res) => {
res.send('Chat Server is running on port 3000')
});

io.on('connection', (socket) => {
console.log('user connected')
socket.on('join', function(userNickname) {
        console.log(userNickname +" : has joined the chat "  );
        unn = userNickname
 socket.broadcast.emit('userjoinedthechat',userNickname +" : has   joined the chat ");
    })

socket.on('messagedetection', (senderNickname,messageContent) => {
       //log the message in console 
       console.log(senderNickname+" : " +messageContent)      
      //create a message object 
      let  message = {"message":messageContent, 
                      "senderNickname":senderNickname}  
// send the message to all users including the sender  using io.emit  

        mongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("ChatData");
            var appID = 'dyu567'
            var phone = '0678629382'
            var myobj = {chatid:chatID , appid:appID, mobile:phone, messagecontent:messageContent  };
            dbo.collection("Chats").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("one chat message inserted TO DB");
            db.close();
            });
        }); 

      io.emit('message', message )
      })

socket.on('disconnect', function() {
        socket.broadcast.emit( "userdisconnect" ,' user has left')  
    })
})

server.listen(3000,()=>{
console.log('Node app is running on port 3000')
})
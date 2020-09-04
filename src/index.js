var cors = require('cors')
var express=require('express');
var Pedido=require('./models/Pedido');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path=require('path');
require('./database');
app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public.html');
});
app.get('/adminpro', function(req, res){
    res.sendFile(__dirname + '/admin.html');
});
app.get('/chat', function(req, res){
    res.sendFile(__dirname + '/chat.html');
});

io.on('connection', async (socket) => {
    let messages = await Pedido.find({estado:'ACTIVO'}).sort('-created');
    socket.emit('load old msgs', messages);

    socket.on('pedido', async function(dat){
        var newPedido = new Pedido({
            lat: dat.lat,
            lng: dat.lng,
            name: dat.name,
            estado:'ACTIVO'
        });
        await newPedido.save();
        let messages = await Pedido.find({estado:'ACTIVO'}).sort('-created');
        io.emit('Places', messages);
    });
    socket.on('eliminar',async (dat)=> {
        await  Pedido.updateOne({_id:dat.id}, {estado:"INACTIVO"});
        let messages = await Pedido.find({estado:'ACTIVO'}).sort('-created');
        io.emit('Places', messages);
    });
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});
http.listen(app.get('port'), function(){
    console.log('listening on *:'+app.get('port'));
});


// var express=require('express');
// var app = express();
// var cors = require('cors');
// var http = require('http').createServer(app);
// var io = require('socket.io')(http);
// var Pedido=require('./models/Pedido');
// require('./database');
// app.set('PORT',process.env.port || 3000);
// app.use(cors());
// app.use(express.urlencoded({extended:false}));
// app.use(express.json());
// app.use(express.static(__dirname + '/public'));
// app.get('/', (req, res) => {
//     // res.sendFile(__dirname + '/admin.html');
//     res.send('aaa');
// });
// //
// // io.on('connection', async (socket) => {
// //     let messages = await Pedido.find({estado:'ACTIVO'}).sort('-created');
// //     socket.emit('load old msgs', messages);
// //
// //     socket.on('pedido', async function(dat){
// //         var newPedido = new Pedido({
// //             lat: dat.lat,
// //             lng: dat.lng,
// //             name: dat.name,
// //             estado:'ACTIVO'
// //         });
// //         await newPedido.save();
// //         let messages = await Pedido.find({estado:'ACTIVO'}).sort('-created');
// //         io.emit('Places', messages);
// //     });
// //     socket.on('eliminar',async (dat)=> {
// //         await  Pedido.updateOne({_id:dat.id}, {estado:"INACTIVO"});
// //         let messages = await Pedido.find({estado:'ACTIVO'}).sort('-created');
// //         io.emit('Places', messages);
// //     });
// //     socket.on('chat message', (msg) => {
// //         io.emit('chat message', msg);
// //     });
// // });
// http.listen(app.get('PORT'), () => {
//     console.log('listening on *:'+app.get('PORT'));
// });

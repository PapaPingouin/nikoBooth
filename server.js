const http = require('http');
var fs = require('fs');
const shellExec = require('shell-exec')
const Gpio = require('onoff').Gpio;

var button = false;
var led = false;  
try {
	 button = new Gpio(4, 'in', 'falling', {debounceTimeout: 100});
	 led = new Gpio( 17,'out');
}
catch(error) {
  console.log( "GPIO NOT FOUND") ;
  // expected output: ReferenceError: nonExistentFunction is not defined
  // Note - error messages will vary depending on browser
}

var sock = null;

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
	if( req.url != '/'  )
	{
		console.log( req.url );
		//fs.readFile( '.'+req.url );
		fs.readFile('.'+req.url, function(err, data){
		  if(err){
			res.statusCode = 500;
			res.end(`Error getting the file: ${err}.`);
		  } else {
			res.setHeader('Content-type', 'image/jpeg' );
			res.end(data);
		  }
		});
	}
	else
	{
		fs.readFile('./index.html', 'utf-8', function(error, content) {
			res.writeHead(200, {"Content-Type": "text/html"});
			res.end(content);
			console.log( "index.html send");
		});
	}
});

// Chargement de socket.io

var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket, pseudo) {
	sock = socket;
    // Quand on client se connecte, on lui envoie un message
    console.log( "client connecté" );
    
    
    socket.on('launch', function(request) {
		console.log( "Launch "+request);
		shoot();
	});
    
    
    
});

function shoot()
{
	if( led )
		led.writeSync(1);
	var filename = "pictures/test-"+(new Date().toISOString())+"-";
	shellExec('gphoto2 --capture-image-and-download --frames 3 --interval 1 --filename '+filename+'%n.jpg --no-keep')
	sock.emit( 'message', filename );
	
}

function countdown()
{
	sock.emit( 'countdown', '' );
}

if( button )
{
	button.watch((err, value) => {
	  console.log( "Button click");
	  if (err) {
		throw err;
	  }
	 
	  //shoot();
	  countdown();
	});
}

server.listen(3000);
console.log( "Server started port 3000");
console.log( new Date().toISOString() );
console.log( __dirname );

if( led )
	led.writeSync(1);

process.on('SIGINT', () => {
  button.unexport();
  led.unexport();
});


function ledBlink() {
  led.writeSync( led.readSync() ^ 1 );
}

setInterval(ledBlink, 500);

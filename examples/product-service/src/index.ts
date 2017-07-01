import * as express from 'express';
import * as http from 'http';
var router = express.Router();
var debug  = require( 'debug' )( 'order-service:server' );

// Create server
var app = express();

// Route
router.get( "/api/v1/products", ( req: express.Request, res: express.Response, next ) => {
  res.json([
    {
      name: "duck",
      price: 15
    },
    {
      name: 'hammer',
      price: 30
    }
  ]);
} );
app.use( router );

console.info( "started" );

// catch 404 and forward to error handler
app.use( function ( req: express.Request, res: express.Response, next ) {
  var err    = new Error( 'Not Found' );
  res.status = 404;
  next( err );
} );

// error handler
app.use( function ( err, req: express.Request, res: express.Response, next ) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error   = req.app.get( 'env' ) === 'development' ? err : {};

  // render the error page
  res.status = err.status || 500;
  console.error( err );
  res.json( {
    status: "failed",
    message: err.message
  } );
} );

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort( process.env.PORT || '3000' );
app.set( 'port', port );

/**
 * Create HTTP server.
 */

var server = http.createServer( app );

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen( port );
server.on( 'error', onError );
server.on( 'listening', onListening );

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort( val ) {
  var port = parseInt( val, 10 );

  if ( isNaN( port ) ) {
    // named pipe
    return val;
  }

  if ( port >= 0 ) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError( error ) {
  if ( error.syscall !== 'listen' ) {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch ( error.code ) {
    case 'EACCES':
      console.error( bind + ' requires elevated privileges' );
      process.exit( 1 );
      break;
    case 'EADDRINUSE':
      console.error( bind + ' is already in use' );
      process.exit( 1 );
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug( 'Listening on ' + bind );
}

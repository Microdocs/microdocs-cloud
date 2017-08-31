import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';

let PORT_COUNTER = 40000;

/**
 * Mock Express server
 */
export class MockServer {

  private _app: any;

  constructor() {
    this._app = express();

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded());
  }

  /**
   * Start and bind server
   * @param _port
   */
  open(): number {
    let _port = PORT_COUNTER++;

    // Get port from environment and store in Express.
    let port = normalizePort(_port || '3000');
    this.app.set('port', port);

    // Create HTTP server.
    let server = http.createServer(this.app);

    // Listen on provided port, on all network interfaces.
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    // Normalize a port into a number, string, or false.
    function normalizePort(val) {
      let port = parseInt(val, 10);

      if (isNaN(port)) {
        // named pipe
        return val;
      }

      if (port >= 0) {
        // port number
        return port;
      }

      return false;
    }

    // Event listener for HTTP server "error" event.
    function onError(error) {
      if (error.syscall !== 'listen') {
        throw error;
      }

      let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(bind + ' requires elevated privileges');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(bind + ' is already in use');
          process.exit(1);
          break;
        default:
          throw error;
      }
    }

    // Event listener for HTTP server "listening" event.
    function onListening() {
      let addr = server.address();
      let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
      console.info('Listening on ' + bind);
    }

    return _port;
  }

  /**
   * Close server
   */
  close(): void {
    console.info("Server stopped");
    (<any>this.app).close();
  }

  get app(): express.Express {
    return this._app;
  }

}

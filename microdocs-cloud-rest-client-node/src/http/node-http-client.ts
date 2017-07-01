import * as http from 'http';
import { Observable } from 'rxjs/Observable';
import { HttpClient, Request, Response, Configuration, Parameter } from '@microdocs/cloud-rest-client';

/**
 * HttpClient implementation with NodeJS http client
 */
export class NodeHttpClient implements HttpClient {

  public request( request: Request, configuration: Configuration ): Observable<Response> {
    return Observable.create( (observer => {
      let response = new Response( { request: request } );
      let chunks   = [];

      // Prepare request
      let headers = request.rawHeaders;
      if ( request.rawBody ) {
        headers[ 'Content-Length' ] = Buffer.byteLength( request.rawBody ).toString();
      }
      let reqOptions: http.RequestOptions = {
        protocol: request.protocol + ':',
        host: request.host,
        hostname: request.hostname,
        port: request.port,
        method: request.method.toString(),
        path: request.path,
        headers: request.rawHeaders,
        timeout: request.timeout
      };

      // Send request
      let req = http.request( reqOptions, (res => {
        // Handle response

        response.status   = res.statusCode;
        let contentLength = -1;
        if ( res.headers ) {
          for ( let key in res.headers ) {
            let value = res.headers[ key ];
            let param = new Parameter( { name: key, value: value } );
            response.headers.append( param );

            if ( key.toLowerCase() === 'content-length' ) {
              contentLength = parseInt( value.toString() );
            }
          }
        }

        if ( response.status != 204 && contentLength > 0 ) {
          // Handle response body
          res.setEncoding( 'utf8' );
          res.on( 'data', function ( chunk ) {
            chunks.push( chunk );
          } );
          res.on( 'end', function () {
            let body         = Buffer.concat( chunks ).toString();
            response.rawBody = body;

            // Emit response to observer
            observer.onNext( response );
            observer.complete();
          } );
          // Handle error
          res.on('error', function(err) {
            observer.error(err);
            observer.complete();
          });
        } else {
          // No response body
          // Emit response to observer
          observer.onNext( response );
          observer.complete();
        }
      }) );

      req.on('socket', function (socket) {
        socket.setTimeout(request.timeout);
        socket.on('timeout', function() {
          req.abort();
        });
      });

      // Handle error
      req.on('error', function(err) {
        observer.error(err);
        observer.complete();
      });

      // send body
      if ( request.rawBody ) {
        req.write( request.rawBody );
        req.end();
      }
    }) );
  }

}

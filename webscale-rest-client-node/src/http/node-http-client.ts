import * as http from 'http';
import { Observable } from 'rxjs/Observable';
import { HttpClient, Request, Response, Configuration, Parameter, RequestBuilder } from '@webscale/rest-client';

/**
 * HttpClient implementation with NodeJS http client
 */
export class NodeHttpClient implements HttpClient {

  public request( request: Request, configuration: Configuration ): Observable<Response> {
    return Observable.create( (observer => {
      let response         = new Response( { request: request } );
      let chunks: string = '';

      // Prepare request
      let headers = request.rawHeaders;
      if ( request.rawBody ) {
        headers[ 'Content-Length' ] = Buffer.byteLength( request.rawBody ).toString();
      }
      let reqOptions: http.RequestOptions = {
        protocol: request.protocol + ':',
        host: request.hostname,
        port: request.port,
        method: request.method,
        path: request.path,
        headers: request.rawHeaders,
        timeout: request.timeout || 0
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
          res.on( 'data', function ( chunk:string ) {
            chunks += chunk.toString();
          } );
          res.on( 'end', function () {
            let body         = chunks;
            response.rawBody = body;

            // Emit response to observer
            if(RequestBuilder.isResponseSuccessful(response.status)){
              observer.next( response );
              observer.complete();
            }else{
              observer.error( new Error("Request returned with status " + response.status) );
              observer.complete();
            }
          } );
          // Handle error
          res.on( 'error', function ( err ) {
            observer.error( err );
            observer.complete();
          } );
        } else {
          // No response body
          // Emit response to observer
          if(RequestBuilder.isResponseSuccessful(response.status)){
            observer.next( response );
            observer.complete();
          }else{
            observer.error( new Error("Request returned with status " + response.status) );
            observer.complete();
          }
        }
      }) );

      req.on( 'socket', function ( socket ) {
        socket.setTimeout( reqOptions.timeout );
        socket.on( 'timeout', function () {
          req.abort();
        } );
      } );

      // Handle error
      req.on( 'error', function ( err ) {
        if ( err.message === 'socket hang up' ) {
          err.message = "timeout";
        }
        observer.error( err );
        observer.complete();
      } );

      // send body
      if ( request.rawBody ) {
        req.write( request.rawBody );
      }
      req.end();
    }) );
  }

}

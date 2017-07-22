import { assert } from 'chai';
import { Observable } from "rxjs";
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { Request, RequestMethod } from '@webscale/rest-client';

import { MockServer } from './mock-server.spec';
import { NodeHttpClient } from "../http/node-http-client";

const SERVER_PORT = 45958;

describe( 'NodeHttpClient', () => {

  it( "HTTP Get", ( done: any ) => {
    // Arrange
    let server = new MockServer();
    server.app.get( "/home", ( req: ExpressRequest, res: ExpressResponse ) => {
      res.sendStatus( 200 );
    } );
    server.open( SERVER_PORT );

    let request = new Request( {
      method: RequestMethod.Get,
      host: 'localhost:' + SERVER_PORT,
      path: '/home',
      timeout: 200
    } );
    let client  = new NodeHttpClient();

    // Act
    client.request( request, null ).subscribe( response => {
      try {
        assert.equal( response.status, 200 );
        done();
      } catch ( e ) {
        done( e );
      } finally {
        server.close();
      }
    }, error => {
      done( error );
      server.close();
    } );
  } );

  it( "HTTP Get response", ( done: any ) => {
    // Arrange
    let server = new MockServer();
    server.app.get( "/home", ( req: ExpressRequest, res: ExpressResponse ) => {
      res.sendStatus( 200 );
      res.json( {
        hello: true
      } );
    } );
    server.open( SERVER_PORT );

    let request = new Request( {
      method: RequestMethod.Get,
      host: 'localhost:' + SERVER_PORT,
      path: '/home',
      timeout: 200
    } );
    let client  = new NodeHttpClient();

    // Act
    client.request( request, null ).subscribe( response => {
      try {
        assert.equal( response.status, 200 );
        done();
      } catch ( e ) {
        done( e );
      } finally {
        server.close();
      }
    }, error => {
      done( error );
      server.close();
    } );
  } );

  it( "HTTP Post", ( done: any ) => {
    // Arrange
    let server = new MockServer();
    server.app.post( "/home", ( req: ExpressRequest, res: ExpressResponse ) => {
      res.sendStatus( 201 );
      res.json( req.body );
    } );
    server.open( SERVER_PORT );

    let request = new Request( {
      method: RequestMethod.Post,
      host: 'localhost:' + SERVER_PORT,
      path: '/home',
      timeout: 200,
      body: { hello: true }
    } );
    let client  = new NodeHttpClient();

    // Act
    client.request( request, null ).subscribe( response => {
      try {
        assert.equal( response.status, 201 );
        assert.deepEqual( response.body, { hello: true } );
        done();
      } catch ( e ) {
        done( e );
      } finally {
        server.close();
      }
    }, error => {
      done( error );
      server.close();
    } );
  } );

} );

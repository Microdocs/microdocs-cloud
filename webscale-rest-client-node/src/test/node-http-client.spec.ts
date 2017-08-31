import {assert} from 'chai';
import {Request as ExpressRequest, Response as ExpressResponse} from 'express';
import {Request, RequestMethod, ParameterList, HttpServerException} from '@webscale/rest-client';

import {MockServer} from './mock-server.spec';
import {NodeHttpClient} from "../http/node-http-client";

describe('NodeHttpClient', () => {

  it("HTTP Get", (done: any) => {
    // Arrange
    let server = new MockServer();
    server.app.get("/home", (req: ExpressRequest, res: ExpressResponse) => {
      res.sendStatus(200);
    });
    let port = server.open();

    let request = new Request({
      method: RequestMethod.Get,
      host: 'localhost:' + port,
      path: '/home',
      timeout: 200
    });
    let client = new NodeHttpClient();

    // Act
    client.request(request, null).subscribe(response => {
      try {
        assert.equal(response.status, 200);
        done();
      } catch (e) {
        done(e);
      } finally {
        server.close();
      }
    }, error => {
      done(error);
      server.close();
    });
  });

  it("HTTP Get response", (done: any) => {
    // Arrange
    let server = new MockServer();
    server.app.get("/home", (req: ExpressRequest, res: ExpressResponse) => {
      res.status(200);
      res.json({
        hello: true
      });
    });
    let port = server.open();

    let request = new Request({
      method: RequestMethod.Get,
      host: 'localhost:' + port,
      path: '/home',
      timeout: 200
    });
    let client = new NodeHttpClient();

    // Act
    client.request(request, null).subscribe(response => {
      try {
        assert.equal(response.status, 200);
        done();
      } catch (e) {
        done(e);
      } finally {
        server.close();
      }
    }, error => {
      done(error);
      server.close();
    });
  });

  it("HTTP Post", (done: any) => {
    // Arrange
    let server = new MockServer();
    server.app.post("/home", (req: ExpressRequest, res: ExpressResponse) => {
      res.status(201);
      res.json(req.body);
    });
    let port = server.open();

    let request = new Request({
      method: RequestMethod.Post,
      host: 'localhost:' + port,
      path: '/home',
      timeout: 200,
      body: JSON.stringify({hello: true}),
      headers: new ParameterList({
        'content-type': 'application/json'
      })
    });
    let client = new NodeHttpClient();

    // Act
    client.request(request, null).subscribe(response => {
      try {
        assert.equal(response.status, 201);
        assert.deepEqual(response.body, {hello: true});
        done();
      } catch (e) {
        done(e);
      } finally {
        server.close();
      }
    }, error => {
      done(error);
      server.close();
    });
  });

  it("Error on 500 response", (done: any) => {
    // Arrange
    let server = new MockServer();
    server.app.post("/home", (req: ExpressRequest, res: ExpressResponse) => {
      res.status(500);
      res.json({error: "something went wrong"});
    });
    let port = server.open();

    let request = new Request({
      method: RequestMethod.Post,
      host: 'localhost:' + port,
      path: '/home',
      timeout: 200,
      body: JSON.stringify({hello: true}),
      headers: new ParameterList({
        'content-type': 'application/json'
      })
    });
    let client = new NodeHttpClient();

    // Act
    client.request(request, null).subscribe(response => {
      try {
        assert.fail();
      } catch (e) {
        done(e);
      }
    }, error => {
      try {
        assert.equal(error.name, "HttpServerException");
        assert.equal(error.status, 500);
        assert.deepEqual(error.body, {error: "something went wrong"});
        done();
      } catch (e) {
        done(e);
      }
    });
  })

});

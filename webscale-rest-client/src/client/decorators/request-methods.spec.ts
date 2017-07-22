
import {assert} from 'chai';
import { Observable } from "rxjs";
import { HttpClient } from "../../http/http-client";
import { Response } from '../../http/response';
import { Request } from '../../http/request';
import { RequestMethod } from '../../http/request-method';
import { RestClient } from "../rest-client";
import { Get, Post } from "./request-methods";
import { Client } from "./client";

describe('@Get', () => {

  it('verify request method is set', () => {
    // Arrange
    var method;
    var path;
    let requestMock = new RequestMock((req:Request) => {
      method = req.method;
      path = req.path;
      return Observable.of(new Response());
    });
    let testClient = new TestClient(requestMock);

    // Act
    testClient.getItems().subscribe();

    assert.equal(method, RequestMethod.Get);
    assert.equal(path, '/test');

  });
});

describe('@Post', () => {

  it('verify request method is set', () => {
    // Arrange
    var method;
    var path;
    let requestMock = new RequestMock((req:Request) => {
      method = req.method;
      path = req.path;
      return Observable.of(new Response());
    });
    let testClient = new TestClient(requestMock);

    // Act
    testClient.createItems().subscribe();

    assert.equal(method, RequestMethod.Post);
    assert.equal(path, '/test');

  });
});

class RequestMock implements HttpClient{

  constructor(private requestFunction:(req:Request) =>Observable<Response>){}

  public callCount:number = 0;
  public lastRequest:Request;

  public request(req:Request):Observable<Response> {
    this.callCount++;
    this.lastRequest = req;
    return this.requestFunction(req);
  }
}

class TestClient extends RestClient {

  constructor(httpClient:HttpClient){
    super(httpClient );
  }

  @Get('/test')
  public getItems():Observable<Response>{
    return null;
  }

  @Post('/test')
  public createItems():Observable<Response>{
    return null;
  }

}


import {assert} from 'chai';
import { Observable } from "rxjs";
import { HttpClient } from "../../http/http-client";
import { Request } from "../../http/request";
import { Response, ResponseOptions } from "../../http/response";
import { RestClient } from "../rest-client";
import { Get } from "./request-methods";
import { Client } from "./client";
import { DefaultRestConfiguration } from "../../builder/default-rest-configuration";
import { RestConfiguration } from "../../builder/rest-configuration";

describe('@Client', () => {

  it('verify decorator attributes are added to the request', () => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      return Observable.of(new Response({status: 200}));
    });
    let testClient = new TestClient(requestMock);

    // Assert
    assert.equal(testClient.getServiceId(), 'customer-service');
    assert.equal(testClient.getBaseUrl(), '/api/v1/customers');
    assert.deepEqual(testClient.getDefaultHeaders(), {
      'content-type': 'application/json'
    });
    assert.isNotNull(testClient.getConfiguration());
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

@Client({
  serviceId: 'customer-service',
  baseUrl: '/api/v1/customers',
  headers: {
    'content-type': 'application/json'
  },
  configuration: new DefaultRestConfiguration()
})
class TestClient extends RestClient {

  constructor(httpClient:HttpClient){
    super(httpClient );
  }

  @Get('/test')
  public getItems():Observable<Response>{
    return null;
  }

}

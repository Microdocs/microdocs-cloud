
import {assert} from 'chai';
import { Observable } from "rxjs";
import { HttpClient } from "../../http/http-client";
import { Response } from '../../http/response';
import { Request } from '../../http/request';
import { RestClient } from "../rest-client";
import { Get } from "./request-methods";
import { Map } from "./map";
import { Produces, MediaType } from "./produces";

describe('@Produces', () => {

  it('verify Produces function is called', (done:(e?:any)=>void) => {
    // Arrange
    let requestMock = new RequestMock((req:Request) => {
      let json:any = {name: 'itemName', desc: 'Some awesome item'};
      return Observable.of(new Response({rawBody: JSON.stringify(json)}));
    });
    let testClient = new TestClient(requestMock);

    // Act
    let result = testClient.getItems();

    // Assert
    result.subscribe(item => {
      try {
        assert.equal( item['name'], 'itemName' );
        assert.equal( item['desc'], 'Some awesome item' );
        done();
      }catch(e){
        done(e);
      }
    });

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
  @Produces(MediaType.JSON)
  public getItems():Observable<{}>{
    return null;
  }

}

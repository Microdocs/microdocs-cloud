import { assert } from 'chai';
import { Observable } from "rxjs";
import { HttpClient } from "../../http/http-client";
import { Response } from '../../http/response';
import { Request } from '../../http/request';
import { RestClient } from "../rest-client";
import { Get } from "./request-methods";
import { Retry } from "./retry";

describe( '@Retry', () => {

  it( 'verify request is retrying', ( done: ( e?: any ) => void ) => {
    // Arrange
    let count       = 0;
    let retries;
    let attempts;
    let requestMock = new RequestMock( ( req: Request ) => {
      return Observable.create( observer => {
        count++;
        retries  = req.retries;
        attempts = req.attempts;
        observer.error( "fail" );
      } );
    } );
    let testClient  = new TestClient( requestMock );

    // Act
    let result = testClient.getItems();

    // Assert
    result.subscribe( item => {
      try {
        assert.fail( "request may not succeed" );
      } catch ( e ) {
        done( e );
      }
    }, error => {
      try {
        assert.equal( count, 3 );
        assert.equal( retries, 3 );
        assert.equal( attempts, 3 );
        done();
      } catch ( e ) {
        done( e );
      }
    } );

  } );
} );

class RequestMock implements HttpClient {

  constructor( private requestFunction: ( req: Request ) => Observable<Response> ) {
  }

  public callCount: number = 0;
  public lastRequest: Request;

  public request( req: Request ): Observable<Response> {
    this.callCount++;
    this.lastRequest = req;
    return this.requestFunction( req );
  }
}

class TestClient extends RestClient {

  constructor( httpClient: HttpClient ) {
    super( httpClient );
  }

  @Get( '/test' )
  @Retry( 3 )
  public getItems(): Observable<Item> {
    return null;
  }

}

class Item {

  public name: string;
  public desc: string;

  constructor( props: { name: string, desc: string } ) {
    this.name = props.name;
    this.desc = props.desc;
  }
}

import { Observable } from "rxjs/Observable";
import { HttpClient } from "../http/http-client";
import { Configuration } from "../builder/configuration";
import { Request } from "../http/request";
import { Response } from "../http/response";
import { RequestBuilder } from "../builder/request-builder";
import { RequestInterceptor } from "../builder/request-interceptor";
import { ResponseInterceptor } from "../builder/response-interceptor";
import { DefaultConfiguration } from "../builder/default-configuration";

/**
 * RestClient class.
 *
 * @class RestClient
 * @constructor
 */
export class RestClient implements RequestInterceptor, ResponseInterceptor {

  private requestBuilder: RequestBuilder;
  private httpClient: HttpClient;

  public constructor( httpClient?: HttpClient ) {
    this.httpClient     = httpClient;
    // init request builder
    this.requestBuilder = new RequestBuilder()
      .configuration( this.getConfiguration() || new DefaultConfiguration() )
      .requestInterceptor( this )
      .responseInterceptor( this );
    if ( httpClient ) {
      this.requestBuilder.httpClient( httpClient );
    }
    if ( this.getServiceId() ) {
      this.requestBuilder.serviceId( this.getServiceId() );
    }
  }

  getServiceId(): string {
    return null;
  }

  getBaseUrl(): string {
    return null;
  }

  getDefaultHeaders(): any {
    return null;
  }

  getConfiguration(): Configuration {
    return null;
  }

  getHttpClient(): HttpClient {
    return this.httpClient;
  }

  getRequestBuilder(): RequestBuilder {
    return this.requestBuilder;
  }

  /**
   * Request Interceptor
   *
   * @method requestInterceptor
   * @param {Request} req - request object
   */
  public requestInterceptor( request: Request ): void {
    //
  }

  /**
   * Response Interceptor
   *
   * @method responseInterceptor
   * @param {Response} res - response object
   * @returns {Response} res - transformed response object
   */
  public responseInterceptor( res: Observable<Response> ): Observable<any> {
    return res;
  }

}

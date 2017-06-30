
import { Observable } from "rxjs/Observable";
import { HttpClient } from "../http/http-client";
import { RestConfiguration } from "../builder/rest-configuration";
import { Request } from "../http/request";
import { Response } from "../http/response";

/**
 * RestClient class.
 *
 * @class RestClient
 * @constructor
 */
export class RestClient {

  public constructor( protected httpClient: HttpClient) {
  }

  getServiceId(): string{
    return null;
  }

  getBaseUrl(): string {
    return null;
  }

  getDefaultHeaders(): any {
    return null;
  }

  getConfiguration(): RestConfiguration {
    return null;
  }

  getHttpClient(): HttpClient {
    return this.httpClient;
  }

  /**
   * Request Interceptor
   *
   * @method requestInterceptor
   * @param {Request} req - request object
   */
  protected requestInterceptor(req: Request):void {
    //
  }

  /**
   * Response Interceptor
   *
   * @method responseInterceptor
   * @param {Response} res - response object
   * @returns {Response} res - transformed response object
   */
  protected responseInterceptor(res: Observable<Response>): Observable<any> {
    return res;
  }

}

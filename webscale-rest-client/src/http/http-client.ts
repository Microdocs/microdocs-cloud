import { Observable } from "rxjs/Observable";
import { Request } from '../http/request';
import { Response } from '../http/response';
import { Configuration } from '../builder/configuration';

/**
 * This adapter class makes it possible use an own implementation of a HTTP client
 *
 * @export
 * @interface HttpClient
 */
export interface HttpClient {

  /**
   * Make HTTP request and returns a Response using a rxjs Observable
   *
   * @param {Request} request
   * @returns {Observable<Response>}
   * @memberof HttpClient
   */
  request( request: Request, configuration: Configuration ): Observable<Response>;

}

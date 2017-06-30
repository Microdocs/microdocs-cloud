
import { Observable } from "rxjs/Observable";
import { Response } from '../http/response';


/**
 * Response interceptor
 *
 * @export
 * @interface ResponseInterceptor
 */
export interface ResponseInterceptor {

  responseInterceptor(response: Observable<Response>): Observable<Response>;

}

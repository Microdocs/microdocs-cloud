
import {Request} from '../http/request';

/**
 * Request interceptor
 *
 * @export
 * @interface RequestInterceptor
 */
export interface RequestInterceptor {

  requestInterceptor(request: Request): void;

}

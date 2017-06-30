
import {RequestInterceptor} from './request-interceptor';
import {ResponseInterceptor} from './response-interceptor';
import {HttpClient} from '../http/http-client';
import {ObjectMapper} from '../object-mapper/object-mapper';
import {ParameterObjectMapper} from '../object-mapper/parameter-object-mapper';
import {Request} from '../http/request';
import {Response} from '../http/response';

/**
 * Configuration options for the RestBuilder
 *
 * @export
 * @interface Configuration
 */
export interface Configuration {

  httpClient:HttpClient;

  requestInterceptors:RequestInterceptor[];
  responseInterceptors:ResponseInterceptor[];

  bodyObjectMapper:ObjectMapper;
  queryObjectMapper:ParameterObjectMapper;
  pathObjectMapper:ParameterObjectMapper;
  headerObjectMapper:ParameterObjectMapper;

}

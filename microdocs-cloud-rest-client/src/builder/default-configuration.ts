
import {Configuration} from './configuration';
import {RequestInterceptor} from './request-interceptor';
import {ResponseInterceptor} from './response-interceptor';
import {HttpClient} from '../http/http-client';
import {ObjectMapper} from '../object-mapper/object-mapper';
import {ParameterObjectMapper} from '../object-mapper/parameter-object-mapper';
import {JsonObjectMapper} from '../object-mapper/json-object-mapper';
import {UrlEncodingObjectMapper} from '../object-mapper/url-encoding-object-mapper';
import { HeaderObjectMapper } from "../object-mapper/header-object-mapper";
import { ServerList } from "../loadbalancer/server-list";
import { LoadbalancerRule } from "../loadbalancer/rules/loadbalancer-rule";
import { LoadbalancerFilter } from "../loadbalancer/filters/loadbalancer-filter";

/**
 * Default configuration
 *
 * @export
 * @class DefaultConfiguration
 * @implements {Configuration}
 */
export class DefaultConfiguration implements Configuration {

  httpClient:HttpClient = null;

  requestInterceptors:RequestInterceptor[] = [];
  responseInterceptors:ResponseInterceptor[] = [];

  bodyObjectMapper:ObjectMapper = new JsonObjectMapper();
  queryObjectMapper:ParameterObjectMapper = new UrlEncodingObjectMapper();
  pathObjectMapper:ParameterObjectMapper = new UrlEncodingObjectMapper();
  headerObjectMapper:ParameterObjectMapper = new HeaderObjectMapper();

  serverList: new ( serviceName: string ) => ServerList;
  loadbalancerRule:LoadbalancerRule;
  loadbalancerFilters:LoadbalancerFilter[];

}

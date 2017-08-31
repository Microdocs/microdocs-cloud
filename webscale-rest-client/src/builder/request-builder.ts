import { Observable } from "rxjs/Observable";
import { LoggerFactory, Logger, LogLevel } from "@webscale/logging";

import { RequestInterceptor } from './request-interceptor';
import { ResponseInterceptor } from './response-interceptor';
import { Configuration } from './configuration';
import { DefaultConfiguration } from './default-configuration';
import { HttpClient } from '../http/http-client'
import { Request } from '../http/request';
import { Response } from '../http/response';
import { HttpConfigurationException } from '../exception/http-configuration-exception';
import { HttpRequestException } from '../exception/http-request-exception';
import { ObjectMapper } from '../object-mapper/object-mapper';
import { ParameterObjectMapper } from '../object-mapper/parameter-object-mapper';
import { Parameter } from "../http/parameter";
import { Loadbalancer } from "../loadbalancer/loadbalancer";
import { ServerList } from "../loadbalancer/server-list";
import { LoadbalancerRule } from "../loadbalancer/rules/loadbalancer-rule";
import { LoadbalancerFilter } from "../loadbalancer/filters/loadbalancer-filter";

const logger:Logger = LoggerFactory.create("webscale.rest-client");

/**
 * Build and execute a HTTP request
 * Support for loadbalancing, service discovery and retry
 *
 * @export
 * @class RequestBuilder
 */
export class RequestBuilder {

  private _configuration: Configuration = new DefaultConfiguration();
  private _serviceId: string;

  /**
   * Add Configuration Object. This only overwrites the non-null values
   *
   * @param {RestConfiguration} configuration
   * @returns {RequestBuilder}
   * @memberof RequestBuilder
   */
  public configuration( configuration: Configuration ): RequestBuilder {
    if ( !configuration ) {
      throw new HttpConfigurationException( "configuration cannot be null or " + configuration );
    }
    for ( let key in configuration ) {
      let value = configuration[ key ];
      if ( value !== null || value !== undefined ) {
        this._configuration[ key ] = value;
      }
    }
    return this;
  }

  /**
   * Set the HTTP client to use
   *
   * @param {HttpClient} httpClient
   * @returns {RequestBuilder}
   * @memberof RequestBuilder
   */
  public httpClient( httpClient: HttpClient ): RequestBuilder {
    this._configuration.httpClient = httpClient;
    return this;
  }

  /**
   * Add a Body Object mapper
   *
   * @param {ObjectMapper} objectMapper
   * @returns {RequestBuilder}
   * @memberof RequestBuilder
   */
  public bodyObjectMapper( objectMapper: ObjectMapper ): RequestBuilder {
    this._configuration.bodyObjectMapper = objectMapper;
    return this;
  }

  /**
   * Add a Path Object mapper
   *
   * @param {ObjectMapper} objectMapper
   * @returns {RequestBuilder}
   * @memberof RequestBuilder
   */
  public pathObjectMapper( parameterObjectMapper: ParameterObjectMapper ): RequestBuilder {
    this._configuration.pathObjectMapper = parameterObjectMapper;
    return this;
  }

  /**
   * Add a Query Object mapper
   *
   * @param {ObjectMapper} objectMapper
   * @returns {RequestBuilder}
   * @memberof RequestBuilder
   */
  public queryObjectMapper( parameterObjectMapper: ParameterObjectMapper ): RequestBuilder {
    this._configuration.queryObjectMapper = parameterObjectMapper;
    return this;
  }

  /**
   * Add a Header Object mapper
   *
   * @param {ObjectMapper} objectMapper
   * @returns {RequestBuilder}
   * @memberof RequestBuilder
   */
  public headerObjectMapper( parameterObjectMapper: ParameterObjectMapper ): RequestBuilder {
    this._configuration.headerObjectMapper = parameterObjectMapper;
    return this;
  }

  /**
   * Add request interceptor
   *
   * @param {RequestInterceptor} requestInterceptor
   * @returns {RequestBuilder}
   * @memberof RequestBuilder
   */
  public requestInterceptor( requestInterceptor: RequestInterceptor ): RequestBuilder {
    this._configuration.requestInterceptors.push( requestInterceptor );
    return this;
  }

  /**
   * Add response interceptor
   *
   * @param {ResponseInterceptor} responseInterceptor
   * @returns {RequestBuilder}
   * @memberof RequestBuilder
   */
  public responseInterceptor( responseInterceptor: ResponseInterceptor ): RequestBuilder {
    this._configuration.responseInterceptors.push( responseInterceptor );
    return this;
  }

  /**
   * Set service id for the service discovery
   * @param {string} serviceId
   * @return {RequestBuilder}
   * @memberof RequestBuilder
   */
  public serviceId( serviceId: string ): RequestBuilder {
    this._serviceId = serviceId;
    return this;
  }

  /**
   * Set ServerList for service discovery
   * @param serverList
   * @return {RequestBuilder}
   */
  public serverList( serverList: new ( serviceName: string ) => ServerList ): RequestBuilder {
    this._configuration.serverList = serverList;
    return this;
  }

  /**
   * Set Loadbalancer Rule
   * @param loadbalancerRule
   * @return {RequestBuilder}
   */
  public loadbalancerRule( loadbalancerRule: LoadbalancerRule ): RequestBuilder {
    this._configuration.loadbalancerRule = loadbalancerRule;
    return this;
  }

  /**
   * Add Loadbalancer Filter
   * @param loadbalancerFilter
   * @return {RequestBuilder}
   */
  public loadbalancerFilter( loadbalancerFilter: LoadbalancerFilter ): RequestBuilder {
    if ( !this._configuration.loadbalancerFilters ) {
      this._configuration.loadbalancerFilters = [ loadbalancerFilter ];
    } else {
      this._configuration.loadbalancerFilters.push( loadbalancerFilter );
    }
    return this;
  }

  /**
   * Set Loadbalancer Filters
   * @param loadbalancerFilters
   * @return {RequestBuilder}
   */
  public loadbalancerFilters( loadbalancerFilters: LoadbalancerFilter[] ): RequestBuilder {
    this._configuration.loadbalancerFilters = loadbalancerFilters;
    return this;
  }

  /**
   * Set Retries
   * @param number
   * @return {RequestBuilder}
   */
  public retries( retries: number ): RequestBuilder {
    this._configuration.retries = retries;
    return this;
  }

  /**
   * Set Request Timeout
   * @param timeout
   * @return {RequestBuilder}
   */
  public timeout( timeout: number ): RequestBuilder {
    this._configuration.timeout = timeout;
    return this;
  }

  /**
   * Make HTTP request
   *
   * @param {Request} request
   * @returns {Observable<Response>}
   * @memberof RequestBuilder
   * @throws HttpConfigurationException when the request is not build up properly
   */
  public request( request: Request ): Observable<Response> {
    let httpClient = this._configuration.httpClient;
    if ( !httpClient ) {
      throw new HttpConfigurationException( "HttpClient is missing" );
    }

    // Resolve path parameters
    request.originalPath = request.path;
    request.pathParameters.forEach( param => {
      let query = `{${param.name}}`;
      if ( request.path.indexOf( query ) === -1 ) {
        throw new HttpRequestException( `Unknown path variable '${param.name}' in url '${request.originalPath}'` );
      }
      if ( param.value !== null && param.value !== undefined && param.value !== "" ) {
        let pair     = this.serializePathParameter( param );
        request.path = request.path.replace( `{${param.name}}`, pair.value );
      }
    } );

    // Find unresolved path parameters
    let regex  = /\{(.*)\}/;
    let result = regex.exec( request.path );
    if ( result && result.length > 1 ) {
      throw new HttpRequestException( `Missing path variable '${result[ 1 ]}' in url '${request.originalPath}'` );
    }

    // Resolve query parameters
    request.queryParameters.forEach( param => {
      if ( param.value !== null && param.value !== undefined && param.value !== "" ) {
        let pair           = this.serializeQueryParameter( param );
        let string: string = '';
        if ( Array.isArray( pair.value ) ) {
          for ( let i = 0; i < pair.value.length; i++ ) {
            if ( i > 0 ) {
              string += '&';
            }
            string += pair.name + "=" + pair.value[ i ];
          }
        } else {
          string += pair.name + "=" + pair.value;
        }
        if ( request.path.indexOf( "?" ) === -1 ) {
          request.path += "?" + string;
        } else {
          request.path += "&" + string;
        }
      }
    } );

    // Resolve request body
    if ( request.body !== undefined && request.body !== null ) {
      request.body     = this.serializeBodyParameter( request.body );
    }

    // Resolve headers
    request.headers = request.headers.map( param => this.serializeHeaderParameter( param ) );

    // Set retries
    request.attempts = 0;
    if ( request.retries === undefined ) {
      request.retries = this._configuration.retries || 1;
    }

    // Set Timeout
    if ( request.timeout === undefined ) {
      request.timeout = this._configuration.timeout || 0;
    }

    // Run request interceptors
    this._configuration.requestInterceptors.forEach( interceptor => {
      interceptor.requestInterceptor( request );
    } );

    // Make request
    let response = this.makeRequest( request );

    // Run response interceptors
    this._configuration.responseInterceptors.forEach( interceptor => {
      response = interceptor.responseInterceptor( response );
    } );

    return response;
  }

  /**
   * @param {Request} request
   * @returns {Observable<Response>}
   * @memberof RequestBuilder
   * @throws HttpConfigurationException when the request is not build up properly
   */
  private makeRequest( request: Request ): Observable<Response> {
    return Observable.create( (observer => {
      // Find available server through service discovery and loadbalancing
      if ( this._serviceId ) {
        request.serviceId = this._serviceId;
      }
      if ( request.serviceId ) {
        if (this._configuration.serverList) {
          // Create loadbalancer
          let serverList = this._configuration.serverList;
          let loadbalancerRule = this._configuration.loadbalancerRule;
          let loadbalancerFilters = this._configuration.loadbalancerFilters;
          let loadbalancer = new Loadbalancer(request.serviceId, serverList, loadbalancerRule, loadbalancerFilters);

          // Find server
          let server = loadbalancer.findNextServer(request);
          if (!server) {
            throw new HttpRequestException("No available servers found for " + request.serviceId);
          } else {
            console.info("Use server " + server.instanceName + " [" + server.host + ":" + server.port + "]");
          }

          request.host = server.host + ':' + server.port;
        }
      }

      // Log request
      this.logRequest(request);

      // Execute HTTP request
      request.attempts++;
      let response = this._configuration.httpClient.request( request, this._configuration );

      response.subscribe( response => {
        // Log response
        this.logResponse(response);

        // Return success
        observer.next( response );
        observer.complete();
      }, error => {
        if ( request.attempts >= request.retries ) {
          // Log error
          if(logger.shouldLog(LogLevel.debug)){
            logger.debug(error.message + " - retries (" + request.attempts + "/" + request.retries + ")", error);
            if(error.response){
              this.logResponse(error.response);
            }
          }

          // Done retrying
          observer.error( error );
          observer.complete();
        } else {
          // Log error
          if(logger.shouldLog(LogLevel.debug)){
            logger.debug(error.message + " - retries (" + request.attempts + "/" + request.retries + ")", error);
            if(error.response){
              this.logResponse(error.response);
            }
          }

          // retry
          this.makeRequest( request ).subscribe( observer );
        }
      } );
    }) );
  }

  /**
   * Log Request
   * @param {Request} request
   */
  private logRequest(request: Request){
    if(logger.shouldLog(LogLevel.verbose)) {
      logger.verbose( "request > " + request.method + " " + request.url);
      if (logger.shouldLog(LogLevel.silly)) {
        request.headers.forEach(header => {
          logger.debug("header > " + header.name + ": " + header.value);
        });
        if (request.body) {
          if (typeof(request.body) === 'string') {
            logger.debug("body > " + request.body);
          } else {
            logger.debug("body > " + JSON.stringify(request.body));
          }
        }
      }
    }
  }

  /**
   * Log Response
   * @param {Response} response
   */
  private logResponse(response: Response){
    if(logger.shouldLog(LogLevel.verbose)) {
      logger.verbose( "response > " + request.response.method + " " + request.response.url);
      if (logger.shouldLog(LogLevel.silly)) {
        response.headers.forEach(header => {
          logger.debug("header > " + header.name + ": " + header.value);
        });
        if (response.body) {
          if (typeof(response.body) === 'string') {
            logger.debug("body > " + response.body);
          } else {
            logger.debug("body > " + JSON.stringify(response.body));
          }
        }
      }
    }
  }

  private serializePathParameter( parameter: Parameter ): { name: string, value: string } {
    return this.serializeParameter( parameter, this._configuration.pathObjectMapper );
  }

  private serializeQueryParameter( parameter: Parameter ): { name: string, value: string } {
    return this.serializeParameter( parameter, this._configuration.queryObjectMapper );
  }

  private serializeHeaderParameter( parameter: Parameter ): { name: string, value: string } {
    return this.serializeParameter( parameter, this._configuration.headerObjectMapper );
  }

  private serializeParameter( parameter: Parameter, mapper: ParameterObjectMapper ): { name: string, value: string } {
    if ( mapper ) {
      return mapper.serializeParameter( parameter );
    }
    throw new HttpRequestException( "Unable to serialize '" + parameter.name + "'" );
  }

  private serializeBodyParameter( body: any ): string {
    if ( this._configuration.bodyObjectMapper ) {
      return this._configuration.bodyObjectMapper.serializeValue( body );
    }
    throw new HttpRequestException( "Unable to serialize request body" );
  }

  /**
   * Check if response status is successful
   * @param status
   * @return {boolean}
   */
  public static isResponseSuccessful( status: number ): boolean {
    return status >= 200 && status < 400;
  }
}

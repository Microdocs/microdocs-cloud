import { Observable } from "rxjs/Observable";

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
  public retries( retries:number ): RequestBuilder {
    this._configuration.retries = retries;
    return this;
  }

  /**
   * Set Request Timeout
   * @param timeout
   * @return {RequestBuilder}
   */
  public timeout( timeout:number ): RequestBuilder {
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
      let rawBody     = this.serializeBodyParameter( request.body );
      request.rawBody = rawBody;
    }

    // Resolve headers
    if ( !request.rawHeaders ) {
      request.rawHeaders = {};
    }
    request.headers.forEach( param => {
      let header                        = this.serializeHeaderParameter( param );
      request.rawHeaders[ header.name ] = header.value;
    } );

    // Set retries
    request.attempts = 0;
    console.info(request.retries);
    if(!request.retries){
      request.retries = this._configuration.retries || 1;
    }

    // Set Timeout
    if(!request.timeout !== undefined){
      request.timeout = this._configuration.timeout || 0;
    }

    // Run request interceptors
    this._configuration.requestInterceptors.forEach( interceptor => {
      interceptor.requestInterceptor( request );
    } );

    // Make request
    let response = this.makeRequest(request);

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
  private makeRequest( request: Request ): Observable<Response>{
    return Observable.create( (observer => {
      // Find available server through service discovery and loadbalancing
      if ( this._serviceId ) {
        request.serviceId = this._serviceId;
      }
      if ( request.serviceId ) {
        if ( this._configuration.serverList ) {
          // Create loadbalancer
          let serverList          = this._configuration.serverList;
          let loadbalancerRule    = this._configuration.loadbalancerRule;
          let loadbalancerFilters = this._configuration.loadbalancerFilters;
          let loadbalancer        = new Loadbalancer( request.serviceId, serverList, loadbalancerRule, loadbalancerFilters );

          // Find server
          let server = loadbalancer.findNextServer( request );
          if ( !server ) {
            throw new HttpRequestException( "No available servers found for " + request.serviceId );
          } else {
            console.info( "Use server " + server.instanceName + " [" + server.host + ":" + server.port + "]" );
          }

          request.host = server.host + ':' + server.port;
        }
      }

      // Execute HTTP request
      request.attempts++;
      let response = this._configuration.httpClient.request( request, this._configuration );

      response.subscribe(response => {
        console.info("response");
        observer.next(response);
        observer.complete();
      }, error => {
        if(request.attempts >= request.retries){
          console.info("error");
          // Done retrying
          observer.error(error);
          observer.complete();
        }else{
          console.info("error (retry)");
          // retry
          this.makeRequest(request).subscribe(observer);
        }
      });
    }) );
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

}

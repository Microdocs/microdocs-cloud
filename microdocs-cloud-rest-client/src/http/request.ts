import { ParameterList } from './parameter-list';
import { RequestMethod } from './request-method';
import { HttpConfigurationException } from '../exception/http-configuration-exception';

/**
 * Request object, contains information about a HTTP request
 *
 * @export
 * @class Request
 */
export class Request {

  method: RequestMethod;
  protocol: string               = "http";
  _host: string;
  path: string;
  originalPath: string;
  serviceId: string;
  timeout: number;
  body: any;
  rawBody: string;
  queryParameters: ParameterList = new ParameterList();
  pathParameters: ParameterList  = new ParameterList();
  headers: ParameterList         = new ParameterList();
  rawHeaders: { [name: string]: string };

  retries: number;
  attempts: number;

  /**
   * Set the url or path of the request
   *
   * @memberof Request
   */
  set url( url: string ) {
    url = url.trim();

    let protocolSplit = url.indexOf( "://" );
    if ( protocolSplit != -1 ) {
      let splittedUrl = url.split( "://" );
      if ( splittedUrl.length != 2 ) {
        throw new HttpConfigurationException( `Invalid URL: ${url}` );
      }
      let protocol       = splittedUrl[ 0 ];
      let hostPath       = splittedUrl[ 1 ];
      let pathSplitPoint = hostPath.indexOf( '/' );
      let host           = hostPath.substring( 0, pathSplitPoint );
      let path           = hostPath.substring( pathSplitPoint );

      this.protocol = protocol;
      this.host     = host;
      this.path     = path;
    } else {
      this.path = url;
    }

    if ( url.indexOf( "/" ) == 0 ) {
      this.path = url;
    } else {
    }
  }

  /**
   * Get the full url of this request
   *
   * @readonly
   * @type {string}
   * @memberof Request
   */
  get url(): string {
    let protocol = this.protocol || "http";
    let host     = this.host;
    let path     = this.path || "/";
    return `${protocol}://${host}${path}`;
  }

  get host(): string {
    let host: string;
    if ( this._host ) {
      host = this._host;
    } else if ( 'window' in this && window.location && window.location.host ) {
      host = window.location.host;
    } else {
      host = "localhost";
    }
    return host;
  }

  set host( host: string ) {
    this._host = host;
  }

  get hostname(): string {
    let host = this.host;
    if ( host.indexOf( ":" ) !== -1 ) {
      let split = host.split( ":" );
      return split[ 0 ];
    }
    return host;
  }

  get port(): number {
    let host = this.host;
    if ( host.indexOf( ":" ) !== -1 ) {
      let split      = host.split( ":" );
      let port       = split[ 1 ];
      let portNumber = parseInt( port );
      if ( portNumber ) {
        return portNumber;
      }
    }
    switch ( this.protocol.toLowerCase() ) {
      case "http":
        return 80;
      case "https":
        return 433;
    }
    return 80;
  }

}

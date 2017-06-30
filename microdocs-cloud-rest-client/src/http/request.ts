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
  protocol: string;
  host: string;
  path: string;
  originalPath: string;
  body: any;
  rawBody: string;
  queryParameters: ParameterList = new ParameterList();
  pathParameters: ParameterList  = new ParameterList();
  headers: ParameterList         = new ParameterList();

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
    let host: string;
    if ( this.host ) {
      host = this.host;
    } else if ( 'window' in this && window.location && window.location.host ) {
      host = window.location.host;
    } else {
      host = "localhost";
    }
    let path = this.path || "/";
    return `${protocol}://${host}${path}`;
  }

}

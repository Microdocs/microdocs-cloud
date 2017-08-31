
import {HttpException} from "./http-exception";
import {Response} from '../http/response'

/**
 * This exception occurs for 4xx http status codes
 */
export class HttpClientException extends HttpException {

  /**
   * Create new exception
   * @param {Response} response
   * @param {string} message error message
   */
  constructor(response: Response, message?:string) {
    super(response, message);
    this.name = "HttpClientException";
  }

}

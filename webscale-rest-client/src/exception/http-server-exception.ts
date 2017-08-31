
import { HttpException } from "./http-exception";
import { Response } from '../http/response';

/**
 * This exception occurs for 5xx http status codes
 */
export class HttpServerException extends HttpException {

  /**
   * Create new exception
   * @param {Response} response
   * @param {string} message error message
   */
  constructor(response: Response, message?:string) {
    super(response, message);
    this.name = "HttpServerException";
  }
}

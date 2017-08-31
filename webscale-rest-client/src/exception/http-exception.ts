import {Response} from '../http/response'

/**
 * This exception occurs for unexpected http status codes
 */
export class HttpException extends Error {

  public response: Response;
  public status: number;
  public body: any;

  /**
   * Create new exception
   * @param {Response} response
   * @param {string} message error message
   */
  constructor(response: Response, message?:string) {
    super(message || "Http status code: " + response.status);
    this.response = response;
    this.status = response.status;
    this.body = response.body;
    this.name = "HttpException";
  }

}


import {Request} from './request';
import { ParameterList } from "./parameter-list";

/**
 * response object, contains information about a HTTP response
 *
 * @export
 * @class Response
 */
export class Response {

  status: number;
  request: Request;
  body:any;
  headers:ParameterList = new ParameterList();

  constructor(options?:ResponseOptions){
    if(options){
      this.request = options.request;
      this.status = options.status;
      this.body = options.body;
    }
  }

  public json():any{
    if(this.body === undefined || this.body === null){
      throw new Error("No body available")
    }
    if(typeof(this.body) === 'string'){
      return JSON.parse(this.body);
    }
    return this.body;
  }

}

export interface ResponseOptions {

  request?:Request;
  status?:number;
  body?:any;

}

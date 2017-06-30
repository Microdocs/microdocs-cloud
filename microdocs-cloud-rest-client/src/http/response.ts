
import {Request} from './request';
import {JsonObjectMapper} from '../object-mapper/json-object-mapper';

/**
 * response object, contains information about a HTTP response
 *
 * @export
 * @class Response
 */
export class Response {

  status: number;
  request: Request;
  rawBody:string;
  body:any;

  constructor(options?:ResponseOptions){
    if(options){
      this.request = options.request;
      this.status = options.status;
      this.rawBody = options.rawBody;
      this.body = options.body;
    }
  }

  public json():any{
    if(this.rawBody === undefined || this.rawBody === null){
      throw new Error("No body available")
    }
    return new JsonObjectMapper().deserializeValue(this.rawBody);
  }

}

export interface ResponseOptions {

  request?:Request;
  status?:number;
  rawBody?:string;
  body?:any;

}

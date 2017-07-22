import { ExchangeType } from "./exchange-type";

/**
 * Server Connection options
 */
export interface ServerOptions {

  host?:string;
  port?:number;
  login?:string;
  password?:string;
  connectionTimeout?:number;
  authMechanism?:string;
  vhost?:string;
  noDelay?:boolean;
  ssl?:{[key:string]:any};

}

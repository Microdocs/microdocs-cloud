import { ExchangeType } from "./exchange-type";
import { QueueOptions } from "./queue-options";
import { ServerOptions } from "./connection-options";

/**
 * Exchange options
 */
export interface EventConnectionOptions {

  config?: EventConnectionOptions| (new () => EventConnectionOptions);
  queue?: QueueOptions | (new () => QueueOptions);
  server?: ServerOptions | (new () => ServerOptions);

  name:string;
  type?:ExchangeType|string;
  passive?:boolean;
  durable?:boolean;
  autoDelete?:boolean;
  noDeclare?:boolean;
  confirm?:boolean;
  arguments?:{[key:string]:any};

}

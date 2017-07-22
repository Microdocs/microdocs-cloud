import { ExchangeType } from "./exchange-type";

/**
 * Queue options
 */
export interface QueueOptions {

  name: string;
  passive?: boolean;
  durable?: boolean;
  exclusive?: boolean;
  autoDelete?: boolean;
  noDeclare?: boolean;
  arugments?: { [key: string]: any };
  closeChannelOnUnsubscribe?: boolean;

}

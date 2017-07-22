import { EventConnectionOptions } from "../options/event-connection-options";
import { EventConnection } from "./event-connection";

/**
 * Adapter for implementing an event connection
 */
export interface EventConnectionAdapter {

  create(options:EventConnectionOptions):EventConnection;

}

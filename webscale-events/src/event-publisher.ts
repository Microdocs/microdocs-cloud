import { Event } from './event';
import { Connection, Exchange, Message } from "amqp-ts";
import { LoggerFactory } from "@webscale/logging";

const logger = LoggerFactory.create("webscale.events");

/**
 * Dispatches events to the event bus
 */
export class EventPublisher {

  private readonly _connection: Connection;
  private readonly _exchange: Exchange;

  /**
   * Create new Event Dispatcher and declare an exchange to use
   * @param {string} exchangeName Name of the topic exchange
   * @param {Connection} connection EventBus connection options
   * @param {Exchange.DeclarationOptions} exchange options
   */
  constructor( exchangeName: string, connection: Connection, options?: Exchange.DeclarationOptions ) {
    // Create exchange
    logger.verbose("Connect event-steam to bus");
    logger.debug("connection options: ", JSON.stringify({
      exchangeName: exchangeName,
      connection: connection,
      options: options
    }));
    this._connection = connection;
    this._exchange = connection.declareExchange(exchangeName, 'topic', options);
  }

  /**
   * Send and event to the EventBus on the specified exchange
   * @param {Event | Object} object event to dispatch
   * @param {string} routingKey
   */
  public send( object: Event | any, routingKey?: string ) {
    let event: Event;
    if (object instanceof Event) {
      event = object;
    } else {
      event = new Event({ body: object, routingKey: routingKey || object.routingKey });
    }
    if (!event.routingKey) {
      throw new Error("Unable to send event: routingKey is missing");
    }
    let string = JSON.stringify(event);
    let message = new Message(string);

    // Log
    logger.verbose("Send event: " + event.routingKey);
    logger.debug("Event content: " + string);

    this._exchange.send(message, event.routingKey);
  }

  /**
   * Close the connection to the EventBus
   */
  public close() {
    this._connection.close();
  }

}

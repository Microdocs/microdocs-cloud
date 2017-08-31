import { Connection, Exchange, Message, Queue } from "amqp-ts";
import { LoggerFactory } from "@webscale/logging";
import { Subject } from "rxjs/Subject";
import { Event } from './event';
import { ISubscription, Subscription } from "rxjs/Subscription";
import { Subscriber } from "rxjs/Subscriber";
import ActivateConsumerOptions = Queue.ActivateConsumerOptions;

const logger = LoggerFactory.create("webscale.events");

/**
 * EventStream which is lisening for events, which are comming from a Exchange on the EventBus
 */
export class EventStream extends Subject<Event> {

  private readonly _connection: Connection;
  private readonly _exchange: Exchange;
  private readonly _queue: Queue;


  /**
   * Create new EventStream and declare an exchange to use
   * @param {EventStreamOptions} options
   */
  constructor( connection:Connection, options: EventStreamOptions ) {
    super();

    // Create exchange and queue
    logger.verbose("Connect event-steam to bus");
    logger.debug("connection options: ", JSON.stringify(options));
    this._connection = connection;
    this._exchange = connection.declareExchange(options.exchange, 'topic', options.exchangeOptions || { durable: true });
    this._queue = connection.declareQueue(options.queue, options.queueOptions || { exclusive: true });
    this._queue.bind(this._exchange, options.routingKey);
    this._queue.activateConsumer(( message: Message ) => this.onReceive(message), options.consumerOptions || { noAck: false });
  }

  /**
   * When a event is received
   * @param {Message} message
   */
  protected onReceive( message: Message ): void {
    // parse event
    let string = message.content.toString();
    let object = JSON.parse(string);
    let event = new Event({
      routingKey: object.routingKey,
      body: object.body,
      guid: object.guid,
      timestamp: object.timestamp,
      original: message
    });

    // Log
    logger.verbose("Receive event: " + event.routingKey);
    logger.debug("Event content: " + string);

    // emitting the event
    this.next(event);
  }

  /**
   * Close the EventStream and connection to the EventBus
   */
  public close() {
    this.complete();
    this._connection.close();
  }

  protected _subscribe( subscriber: Subscriber<Event> ): Subscription {
    return super._subscribe(subscriber);
  }

}

export interface EventStreamOptions {

  exchange: string;
  queue: string;
  exchangeOptions?: Exchange.DeclarationOptions;
  queueOptions?: Queue.DeclarationOptions;
  routingKey: string;
  consumerOptions?: ActivateConsumerOptions;

}

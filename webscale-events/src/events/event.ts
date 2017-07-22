import { v4 as uuid } from 'uuid';

/**
 * Base event
 */
export class Event {

  private _body: string;
  private _routingKey: string;
  private _guid: string;
  private _timestamp: string;

  /**
   * Create new event
   * @param options
   */
  constructor( options?: EventOptions ) {
    this._body       = options.body;
    this._routingKey = options.routingKey;
    this._guid       = options.guid || uuid();
    this._timestamp  = options.timestamp || new Date().toISOString();
  }

  get body(): string {
    return this._body;
  }

  set body( value: string ) {
    this._body = value;
  }

  get routingKey(): string {
    return this._routingKey;
  }

  set routingKey( value: string ) {
    this._routingKey = value;
  }

  get guid(): string {
    return this._guid;
  }

  get timestamp(): string {
    return this._timestamp;
  }
}

/**
 * Base event options
 */
export interface EventOptions {

  body: any;
  routingKey: string;
  guid?: string;
  timestamp?: string;

}

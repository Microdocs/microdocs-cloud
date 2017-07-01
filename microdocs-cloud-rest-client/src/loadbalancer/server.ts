/**
 * Server object used by the loadbalancer
 *
 * @export
 * @class Server
 */
export class Server {

  private _host: string;
  private _port: number;
  private _available: boolean;
  private _serviceName: string;
  private _instanceName: string;
  private _metadata: { [key: string]: any } = {};

  constructor( options: ServerOptions ) {
    this._host         = options.host;
    this._port         = options.port;
    this._available    = options.available === undefined ? true : options.available;
    this._serviceName  = options.serviceName;
    this._instanceName = options.instanceName;
    this._metadata     = options.metadata;
  }

  get host(): string {
    return this._host;
  }

  get port(): number {
    return this._port;
  }

  get available(): boolean {
    return this._available;
  }

  get serviceName(): string {
    return this._serviceName;
  }

  get instanceName(): string {
    return this._instanceName;
  }

  get metadata(): { [p: string]: string } {
    return this._metadata;
  }
}

export interface ServerOptions {

  host: string;
  port: number;
  available?: boolean;
  serviceName?: string;
  instanceName?: string;
  metadata?: { [key: string]: any };

}

import { Server, ServerOptions } from "./server";

/**
 * This class keeps track of each server and their availability
 *
 * @export
 * @class ServerList
 */
export class ServerList {

  protected _servers: Server[];
  private _serviceName: string;

  constructor( serviceName: string, servers?: Server[] ) {
    this._serviceName = serviceName;
    this._servers     = servers;
  }

  /**
   * Initialize the server list
   */
  public initializeServerList(): void {
  }

  /**
   * Update the server list
   * (called periodically)
   */
  public refreshServerList(): void {
  }

  /**
   * Is the server list initialized
   * @return {boolean}
   */
  get initialized(): boolean {
    return this._servers !== undefined;
  }

  /**
   * Get all servers, including servers that are not available
   * @return {Server[]}
   */
  get servers(): Server[] {
    if ( this.initialized ) {
      return this._servers;
    }
    return [];
  }

  /**
   * Get all available servers
   * @return {Server[]}
   */
  get availableServers(): Server[] {
    if ( this.initialized ) {
      return this._servers.filter( server => server.available );
    }
    return [];
  }

  get serviceName(): string {
    return this._serviceName;
  }

  /**
   * Filter servers and return a new ServerList object
   * @param callbackfn
   * @return {ServerList}
   */
  public filter( callbackfn: ( this: void, value: Server, index: number, array: Server[] ) => any ): ServerList {
    let filteredServers = this._servers.filter( callbackfn );
    return new ServerList( this._serviceName, filteredServers );
  }

  /**
   * Create a ServiceList class based on a serviceList definition
   * @param {[serviceId: string]: ServerOptions[]}  serverList
   * @return {new (serviceName:string) => ServerList}
   */
  public static from( serverList: { [serviceId: string]: ServerOptions[] } ): (new ( serviceName: string ) => ServerList) {
    let serverListClass = class extends ServerList {
      constructor( serviceName: string ) {
        super( serviceName );
      }

      initializeServerList(): void {
        let serverOptions: ServerOptions[] = serverList[ this.serviceName ];
        if ( serverOptions ) {
          this._servers = serverOptions.map( options => new Server( options ) );
        } else {
          this._servers = [];
        }
      }
    };
    return serverListClass;
  }
}

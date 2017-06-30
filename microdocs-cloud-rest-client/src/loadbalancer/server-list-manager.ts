import { ServerList } from "./server-list";
import { Server } from "./server";

/**
 * Manage and refresh ServerLists periodically
 *
 * @export
 * @class ServerListManager
 */
export class ServerListManager {

  private static _refreshInterval: number                     = 2500;
  private static _refreshIntervalId: number;
  private static _serverLists: { [name: string]: ServerList } = {};

  /**
   * Register new ServerList and schedule it to refresh periodically
   * @param serverList
   */
  public static register( serverList: ServerList ): void {
    if ( ServerListManager._serverLists[ serverList.serviceName ] && ServerListManager._serverLists[ serverList.serviceName ] !== serverList ) {
      throw new Error( "An other ServerList for " + serverList.serviceName + " is already register" );
    }
    if(!serverList.initialized){
      serverList.initializeServerList();
    }
    ServerListManager._serverLists[ serverList.serviceName ] = serverList;
    if ( !ServerListManager._refreshIntervalId ) {
      ServerListManager.startRefreshing();
    }
  }

  /**
   * Unregister a ServerList by the serviceName
   * @param serviceName
   */
  public static unregister( serviceName: string ): void {
    delete ServerListManager._serverLists[ serviceName ];
    if ( Object.keys( ServerListManager._serverLists ).length == 0 ) {
      ServerListManager.stopRefreshing();
    }
  }

  /**
   * Create new ServerList
   * @param serviceName
   * @param serverListClass
   * @return {ServerList}
   */
  public static create( serviceName: string, serverListClass: new ( serviceName: string ) => ServerList ): ServerList {
    if ( ServerListManager._serverLists[ serviceName ] ) {
      return ServerListManager._serverLists[ serviceName ];
    } else {
      let serverList = new serverListClass(serviceName);
      ServerListManager.register(serverList);
      return serverList;
    }
  }

  /**
   * Get all registered ServerLists
   * @return {ServerList[]}
   */
  public static getServerList(): ServerList[] {
    let serverLists: ServerList[] = [];
    for ( let serviceName in ServerListManager._serverLists ) {
      serverLists.push( ServerListManager._serverLists[ serviceName ] );
    }
    return serverLists;
  }

  /**
   * Clear all ServerLists
   */
  public static clear(): void {
    ServerListManager._serverLists = {};
    ServerListManager.stopRefreshing();
  }

  private static startRefreshing(): void {
    ServerListManager._refreshIntervalId = setInterval( () => {
      for ( let serviceName in ServerListManager._serverLists ) {
        try {
          let serverList = ServerListManager._serverLists[ serviceName ];
          serverList.refreshServerList();
        } catch ( e ) {
          console.warn( "Failed to update the available servers for " + serviceName );
          console.warn( e );
        }
      }
    }, ServerListManager._refreshInterval );
  }

  private static stopRefreshing(): void {
    clearInterval( ServerListManager._refreshIntervalId );
  }

  /**
   * Set resfresh interval
   * @param interval
   */
  public static setRefreshInterval( interval: number ) {
    ServerListManager._refreshInterval = interval;
    ServerListManager.stopRefreshing();
    ServerListManager.startRefreshing();
  }

  /**
   * Get refresh interval
   * @return {number}
   */
  public static getRefreshInterval(): number {
    return ServerListManager._refreshInterval;
  }

}

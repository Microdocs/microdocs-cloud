import { ServerList } from "./server-list";
import { Server } from "./server";
import { ServerListManager } from "./server-list-manager";
import { Request } from '../http';
import { LoadbalancerRule } from "./rules/loadbalancer-rule";
import { LoadbalancerFilter } from "./filters/loadbalancer-filter";
import { RoundRobinRule } from "./rules/round-robin-rule";

/**
 * class to loadbalancer over Servers provided by the ServerList
 *
 * @export
 * @class Loadbalancer
 */
export class Loadbalancer {

  private _serverList: ServerList;
  private _rule: LoadbalancerRule;
  private _filters: LoadbalancerFilter[];

  constructor( serviceName:string, serverListClass: new ( serviceName: string ) => ServerList, rule?: LoadbalancerRule, filters?: LoadbalancerFilter[] ) {
    this._serverList = ServerListManager.create(serviceName, serverListClass);
    this._rule       = rule || new RoundRobinRule();
    this._filters    = filters;
  }

  /**
   * Find the next available server
   * @param request
   */
  public findNextServer( request: Request ): Server {
    let serverList = this._serverList;

    // Filter the ServerList
    if ( this._filters ) {
      this._filters.forEach( filter => {
        serverList = filter.filterServerList( serverList, request );
      } );
    }

    // Find server
    let server = this._rule.findNextServer( serverList, request );
    return server;
  }
}

import { LoadbalancerRule } from "./loadbalancer-rule";
import { ServerList } from "../server-list";
import { Server } from "../server";
import { Request } from "../../http";

/**
 * Round Robin Loadbalancer rule
 */
export class RoundRobinRule implements LoadbalancerRule {

  private static counter: { [serviceName: string]: number } = {};

  /**
   * Reset counter
   */
  public static resetCounter():void{
    RoundRobinRule.counter = {};
  }

  findNextServer( serverList: ServerList, request: Request ): Server {
    let availableServers = serverList.availableServers;
    let allServers       = serverList.servers;
    let count            = RoundRobinRule.counter[ serverList.serviceName ] !== undefined ? RoundRobinRule.counter[ serverList.serviceName ] : -1;

    if ( availableServers.length === 0 ) {
      // No servers available
      return null;
    }

    for ( let i = 0; i < 10; i++ ) {
      // Increment counter
      count++;
      if ( count >= allServers.length ) {
        count = 0;
      }

      // Find available server
      let server = allServers[ count ];
      if ( server.available ) {
        RoundRobinRule.counter[ serverList.serviceName ] = count;
        return server;
      }
    }

    // No available servers found
    return null;
  }

}

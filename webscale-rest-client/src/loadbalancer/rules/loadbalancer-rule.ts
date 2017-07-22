
import { ServerList } from "../server-list";
import { Server } from "../server";
import { Request } from "../../http";

/**
 * Loadbalancer rule to select a Server from the ServerList
 *
 * @export
 * @class LoadbalancerRule
 */
export interface LoadbalancerRule {

  /**
   * Find the next available server
   * @param serverList
   * @param request
   */
  findNextServer(serverList:ServerList, request:Request):Server;

}

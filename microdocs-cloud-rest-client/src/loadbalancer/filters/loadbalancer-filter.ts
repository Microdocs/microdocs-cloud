import { ServerList } from "../server-list";
import { Request } from "../../http";

/**
 * Loadbalancer filter to filter the ServerList
 *
 * @export
 * @class LoadbalancerFilter
 */
export interface LoadbalancerFilter {

  /**
   * Filter the ServerList
   * @param serverList
   * @param request
   */
  filterServerList( serverList: ServerList, request: Request ): ServerList;

}

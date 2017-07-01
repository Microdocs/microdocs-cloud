import { RestClient } from "../rest-client";

/**
 * Defines the number of retries
 * @param {number} retries
 */
export function Retry(retries:number){
  return function(target: RestClient, propertyKey: string, descriptor: any) {
    descriptor.retries = retries;
    return descriptor;
  }
}

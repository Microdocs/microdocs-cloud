import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/filter'

/**
 * Listen for specific events based on a routing key
 * @param routingKey filter events based on the routingKey
 * @param raw return raw event
 */
export function RoutingKey(routingKey: string | { routingKey: string, raw?: boolean }, raw?: boolean) {
  let options: { routingKey: string, raw?: boolean };
  if (typeof(routingKey) === "string") {
    options = {
      routingKey: routingKey,
      raw: raw || false
    };
  } else if (typeof(routingKey) === "object") {
    options = routingKey;
  } else {
    throw new Error("Invalid RoutingKey options: " + routingKey);
  }
  return function (target: any, propertyKey: string, descriptor: any) {
    descriptor.value = function (...args: any[]) {
      let outputStream:Observable<any> = target.getEventStream().filter(event => event.routingKey === options.routingKey);
      if(!options.raw){
        outputStream = outputStream.map(event => {
          event.original.ack();
          return event.body;
        });
      }
      return outputStream;
    };
    return descriptor;
  }
}

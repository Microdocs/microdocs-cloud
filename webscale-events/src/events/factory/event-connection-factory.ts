import { EventConnectionOptions } from "../options/event-connection-options";
import { EventConnection } from "./event-connection";
import { EventConnectionAdapter } from "./event-connection-adapter";

/**
 * Create connections for publishing and dispatching events
 */
export class EventConnectionFactory {

  private static eventConnectionAdapter:EventConnectionAdapter;

  /**
   * Create new Event connection based on connection options
   * @param options
   */
  public static create( options: EventConnectionOptions ): EventConnection {
    let resolvedOptions = EventConnectionFactory.resolveOptions(options);
    return EventConnectionFactory.eventConnectionAdapter.create(resolvedOptions);
  }

  private static resolveOptions( options: EventConnectionOptions ): EventConnectionOptions {
    // merge with sub config
    if(options.config){
      let subOptions;
      if(typeof(options.config) === 'function'){
        subOptions = this.resolveOptions(new options.config());
      }else if(typeof(options.config) === 'object'){
        subOptions = this.resolveOptions(options.config);
      }
      delete options.config;
      for(let key in subOptions){
        if(key !== 'config') {
          options[ key ] = options.config[ key ];
        }
      }
    }

    return options;
  }

}

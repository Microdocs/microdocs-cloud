import { Injections } from "../injections";
import { LoggingFactory } from '@webscale/logging';

const regex  = / (?:.*)\((.*)\)/;
const logger = LoggingFactory.create( "webscale.boot" );

/**
 * Decorator to resolve the constructor arguments from the Injections store
 * @param target
 * @return {{new(...args:any[])=>{}}}
 * @constructor
 */
export function Injectable( target: any ): any {
  let original = target;

  let wrapper = class {
    constructor( ...args ) {
      let result = regex.exec( target.toString() );
      if ( result && result.length >= 2 ) {
        let instance;
        let args         = result[ 1 ].split( "," ).map( arg => arg.trim() ).filter(arg => arg);
        let resolvedArgs = args.map( ( arg, list, index ) => {
          let object = Injections.get( arg );
          if ( !object ) {
            logger.warn( "Missing injection '" + arg + "' on " + target.name );
          }
          return object;
        } );
        return original.apply( this, resolvedArgs );
      } else {
        return original.apply( this, args )
      }
    }
  };

  wrapper.prototype = original.prototype;

  return wrapper;

}

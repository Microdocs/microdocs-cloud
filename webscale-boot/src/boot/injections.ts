import { LoggingFactory } from '@webscale/logging';

const logger = LoggingFactory.create( "webscale.boot" );

/**
 * Injections Registry
 */
export class Injections {

  private static readonly injections: { [name: string]: (new () => Object) | Object } = {};

  /**
   * Register new injectable
   * @param injectable
   * @param name
   */
  public static register( injectable: (new () => Object) | Object, name?: string ) {
    if ( typeof (injectable) !== 'function' && typeof (injectable) !== 'object' ) {
      throw new Error( "Injectable should be of type object or function, not " + typeof(injectable) );
    }
    if ( !name ) {
      if ( typeof(injectable) === 'function' ) {
        name = injectable.name;
      } else {
        name = injectable.constructor.name;
      }
    }

    logger.verbose( "Register injectable: " + name );
    Injections.injections[ name.toLowerCase() ] = injectable;
  }

  /**
   * Get injectable
   * @param name
   * @return {any}
   */
  public static get( name: string ): Object {
    let injectable = Injections.injections[ name.toLowerCase() ];
    if ( !injectable ) {
      return null;
    }
    if ( typeof (injectable) === 'function' ) {
      injectable = new injectable();
      Injections.injections[ name.toLowerCase() ] = injectable;
    }
    return injectable;
  }


}

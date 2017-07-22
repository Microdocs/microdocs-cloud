import { PropertySource } from "./property-source";

/**
 * Property source for Object structured source
 */
export class ObjectPropertySource extends PropertySource {

  private _object: any;

  constructor( sourceName:string, object: any ) {
    super(sourceName);
    this._object = object;
  }

  public getProperty<T extends any>( key: string, defaultValue?: T ): T {
    let value = this.get(this._object, key);
    if(value !== null){
      return value;
    }else{
      return defaultValue || null;
    }
  }

  private get( object: any, key: string ): any {
    let segments = key.split( "." );
    let k        = segments.shift();
    let subKey   = segments.join( "." );

    if ( typeof(object) === 'object' ) {
      let value = object[ k ];
      if ( value === undefined ) {
        return null;
      } else if ( subKey ) {
        return this.get( value, subKey );
      } else {
        return value;
      }
    } else if ( Array.isArray( object ) ) {
      try {
        let intKey = parseInt( k );
        let value  = object[ intKey ];
        if ( value === undefined ) {
          return null;
        } else if ( subKey ) {
          return this.get( value, subKey );
        } else {
          return value;
        }
      } catch ( e ) {
        return null;
      }
    }
    return null;
  }

}

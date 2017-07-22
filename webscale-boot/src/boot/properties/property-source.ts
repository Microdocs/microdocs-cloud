/**
 * Source which holds properties
 */
export abstract class PropertySource {

  private _sourceName: string;

  constructor( sourceName: string ) {
    this._sourceName = sourceName;
  }

  get sourceName(): string {
    return this._sourceName;
  }

  /**
   * Get property
   * @param key
   * @param defaultValue
   * @return {any} value or null if the property doesn't exists
   */
  public abstract getProperty<T extends any>( key: string, defaultValue?: T ): T;

  /**
   * Get property as string
   * @param key
   * @param defaultValue
   * @return {string} value or null if the property doesn't exists
   */
  public getString( key: string, defaultValue: string = null ): string {
    let value = this.getProperty( key, defaultValue );
    if ( value === null ) {
      return null;
    }
    if ( typeof(value) === 'string' ) {
      return value;
    }
    return (<any>value).toString();
  }

  /**
   * Get property as number
   * @param key
   * @param defaultValue
   * @return {number} value or null if the property doesn't exists
   */
  public getNumber( key: string, defaultValue: number = null ): number {
    let value = this.getProperty( key, defaultValue );
    if ( value === null ) {
      return null;
    }
    if ( typeof(value) === 'number' ) {
      return value;
    }
    try {
      return parseInt( value );
    } catch ( e ) {
      return null;
    }
  }

  /**
   * Get property as float
   * @param key
   * @param defaultValue
   * @return {number} value or null if the property doesn't exists
   */
  public getFloat( key: string, defaultValue: number = null ): number {
    let value = this.getProperty( key, defaultValue );
    if ( value === null ) {
      return null;
    }
    if ( typeof(value) === 'number' ) {
      return value;
    }
    try {
      return parseFloat( value );
    } catch ( e ) {
      return null;
    }
  }

  /**
   * Get property as boolean
   * @param key
   * @param defaultValue
   * @return {number} value or null if the property doesn't exists
   */
  public getBoolean( key: string, defaultValue: boolean = null ): boolean {
    let value = this.getProperty( key, defaultValue );
    if ( value === null ) {
      return null;
    }
    if ( typeof(value) === 'boolean' ) {
      return value;
    }
    return value === 'true';
  }

  /**
   * Get property as Object
   * @param key
   * @param defaultValue
   * @return {number} value or null if the property doesn't exists
   */
  public getObject( key: string, defaultValue?: Object ): Object {
    let value = this.getProperty( key, defaultValue );
    if ( typeof(value) === 'object' ) {
      return value;
    }
    return null;
  }

  /**
   * Get property as Array
   * @param key
   * @param defaultValue
   * @return {number} value or null if the property doesn't exists
   */
  public getArray( key: string, defaultValue?: any[] ): any[] {
    let value = this.getProperty( key, defaultValue );
    if ( Array.isArray( value ) ) {
      return value;
    } else {
      return [ value ];
    }
  }

}

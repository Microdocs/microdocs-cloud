import { Parameter } from './parameter'
import { ParameterObjectMapper } from '../object-mapper/parameter-object-mapper';
import { UrlEncodingObjectMapper } from '../object-mapper/url-encoding-object-mapper';
import { HeaderObjectMapper } from '../object-mapper/header-object-mapper';

/**
 * Parameter list
 *
 * @export
 * @class ParameterList
 * @extends {Array<Parameter>}
 */
export class ParameterList {

  private parameters: Parameter[] = [];

  /**
   * Append parameter.
   * If a parameter already existed with the same name, it will be converted to an array
   *
   * @param {Parameter} parameter
   * @memberof ParameterList
   */
  public append( parameter: Parameter ): void {
    let parameters = this.parameters.filter( param => param.name === parameter.name );
    if ( parameters.length > 0 ) {
      let existedParam = parameters[ 0 ];
      if ( Array.isArray( existedParam.value ) ) {
        if ( Array.isArray( parameter.value ) ) {
          parameter.value.forEach( v => {
            existedParam.value.push( v );
          } );
        } else {
          existedParam.value.push( parameter.value );
        }
      } else {
        let array = [ existedParam ];
        if ( Array.isArray( parameter.value ) ) {
          parameter.value.forEach( v => {
            array.push( v );
          } );
        } else {
          array.push( parameter.value );
        }
        existedParam.value = array;
      }
      existedParam.format = existedParam.format || parameter.format;
    } else {
      this.parameters.push( parameter );
    }
  }

  /**
   * Get all values of a specific parameter
   *
   * @param {string} name
   * @returns {*} values or null if the parameter doesn't exists
   * @memberof ParameterList
   */
  public getAll( name: string ): any[] {
    let parameter = this.getParameter( name );
    if ( parameter ) {
      let value = parameter.value;

      if ( !Array.isArray( value ) ) {
        // always return an array
        value = [ value ];
      }
      return value;
    }
    return null;
  }

  /**
   * Get Parameter by name
   *
   * @param {string} name
   * @returns {Parameter} parameter or null if it doesn't exists
   * @memberof ParameterList
   */
  public getParameter( name: string ): Parameter {
    return this.parameters.filter( param => param.name === name )[ 0 ];
  }

  /**
   * Get the serialized value
   *
   * @param {string} name
   * @param {ParameterObjectMapper} [mapper=new UrlEncodingObjectMapper()]
   * @returns {*} serialized value, or null if the parameter doesn't exists
   * @memberof ParameterList
   */
  public get( name: string, mapper: ParameterObjectMapper = new UrlEncodingObjectMapper() ): any {
    let parameter = this.getParameter( name );
    if ( parameter ) {
      return mapper.serializeParameter( parameter ).value;
    }
    return null;
  }

  /**
   * Check if a parameter exists
   *
   * @param {string} name
   * @returns {boolean} true if exists, otherwise false
   * @memberof ParameterList
   */
  public has( name: string ): boolean {
    return this.getParameter( name ) != null;
  }

  /**
   * Performs the specified action for each element in an array.
   * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
   */
  public forEach( callbackfn: ( this: void, value: Parameter, index: number, array: Parameter[] ) => void ) {
    this.parameters.forEach( callbackfn );
  }

  /**
   * Calls a defined callback function on each element of an array, and returns an array that contains the results.
   * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
   */
  public map( callbackfn: ( this: void, value: Parameter, index: number, array: Parameter[] ) => any ): any {
    return this.parameters.map( callbackfn );
  }

}

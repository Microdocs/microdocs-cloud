import { ObjectMapper } from './object-mapper';

/**
 * Serialize and Deserialize objects using JSON
 *
 * @export
 * @class JsonObjectMapper
 * @implements {ObjectMapper}
 */
export class JsonObjectMapper implements ObjectMapper {

  public serializeValue( value: any ): string {
    return JSON.stringify( value );
  }

  public deserializeValue( string: string ): any {
    return JSON.parse( string );
  }

}


/**
 * Serialize and Deserialize objects
 *
 * @export
 * @interface ObjectMapper
 */
export interface ObjectMapper {

  serializeValue(value: any): string;

  deserializeValue(string: string): any;

}

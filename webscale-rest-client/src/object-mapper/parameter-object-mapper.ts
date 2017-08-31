
import { Parameter } from '../http/parameter';

/**
 * Serialize and Deserialize parameters using JSON
 *
 * @export
 * @interface ParameterObjectMapper
 */
export interface ParameterObjectMapper {

  serializeParameter(value: Parameter): Parameter;

  deserializeParameter(string: { name: string, value: string }|Parameter): Parameter;

}

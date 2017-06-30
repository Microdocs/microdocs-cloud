
import { Parameter } from '../http/parameter';

/**
 * Serialize and Deserialize parameters using JSON
 *
 * @export
 * @interface ParameterObjectMapper
 */
export interface ParameterObjectMapper {

  serializeParameter(value: Parameter): { name: string, value: string };

  deserializeParameter(string: { name: string, value: string }): Parameter;

}


import { ParameterObjectMapper } from './parameter-object-mapper';
import { Parameter, Format } from '../http/parameter';

/**
 * Serialize and Deserialize objects for HTTP headers
 *
 * @export
 * @class HeaderObjectMapper
 * @implements {ObjectMapper}
 */
export class HeaderObjectMapper implements ParameterObjectMapper {

  public serializeParameter(parameter: Parameter):Parameter{
    let format = parameter.format || Format.CSV;
    let value = parameter.value;
    if (Array.isArray(value)) {
      value = value.map(v => encodeURIComponent(v));
      switch (format) {
        case Format.CSV:
          value = value.join(',');
          break;
        case Format.SSV:
          value = value.join(' ');
          break;
        case Format.TSV:
          value = value.join('\t');
          break;
        case Format.PIPES:
          value = value.join('|');
          break;
        case Format.MULTI:
          value = value;
          break;
        default:
          value = value.join(',');
      }
    }else{
      value = encodeURIComponent(value);
    }
    let name: string = encodeURIComponent(parameter.name);
    return new Parameter({ name: name, value: value });
  }

  deserializeParameter(param: { name: string, value: string }|Parameter): Parameter {
    let value: string = decodeURIComponent(param.value);
    let name: string = decodeURIComponent(param.name);
    return new Parameter({ name: name, value: value });
  }

}

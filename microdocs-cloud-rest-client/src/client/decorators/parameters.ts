
import { RestClient } from "../rest-client";
import { Parameter, Format } from '../../http/parameter';
import { HttpConfigurationException } from '../../exception/http-configuration-exception'

export function paramBuilder( paramName: string) {
  return function(name: string, value?:any|{value?:any,format?:string}) {
    return function(target: RestClient, propertyKey: string | symbol, parameterIndex: number) {
      let format;
      if(value){
        if(typeof(value) === 'object'){
          if(value.value !== undefined && value.value !== null){
            value = value.value;
          }
          if(value.format !== undefined && value.format !== null){
            if((<any>Format)[value.format] !== undefined) {
              format = value.format;
            }else{
              throw new HttpConfigurationException("Unknown Collection Format: '" + value.format + "'");
            }
          }
        }
      }
      let metadataKey = `${propertyKey}_${paramName}_parameters`;
      let paramObj:Parameter = new Parameter({
        name: name,
        parameterIndex: parameterIndex,
        value: value,
        format: format
      });
      if (Array.isArray((<any>target)[metadataKey])) {
        (<any>target)[metadataKey].push(paramObj);
      } else {
        (<any>target)[metadataKey] = [paramObj];
      }
    };
  };
}

/**
 * Path variable of a method's url, type: string
 * @param {string} key - path key to bind value
 */
export const Path = paramBuilder("Path");
/**
 * Query value of a method's url, type: string
 * @param {string} key - query key to bind value
 */
export const Query = paramBuilder("Query");
/**
 * Body of a REST method, type: key-value pair object
 * Only one body per method!
 */
export const Body = paramBuilder("Body")("Body");
/**
 * Custom header of a REST method, type: string
 * @param {string} key - header key to bind value
 */
export const Header = paramBuilder( "Header" );

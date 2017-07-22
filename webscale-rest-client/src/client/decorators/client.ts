
import { Configuration } from "../../builder/configuration";

/**
 * Configure the REST Client
 * @param {String} url - base URL
 * @param {String} serviceId - Service ID
 * @param {Object} headers - default headers in a key-value pair
 * @param {Configuration|(new () => Configuration} configuration - configuration
 */
export function Client(args:{serviceId?: string, baseUrl?: string, headers?: any, configuration?: Configuration|(new () => Configuration)}) {
  return function <TFunction extends Function>(Target: TFunction): TFunction {
    if(args.serviceId){
      Target.prototype.getServiceId = function() {
        return args.serviceId;
      };
    }
    if(args.baseUrl){
      Target.prototype.getBaseUrl = function() {
        return args.baseUrl;
      };
    }
    if(args.headers){
      Target.prototype.getDefaultHeaders = function() {
        return args.headers;
      };
    }
    if(args.configuration){
      if(typeof(args.configuration) === 'function'){
        args.configuration = new args.configuration();
      }
      Target.prototype.getConfiguration = function() {
        return args.configuration;
      };
    }

    return Target;
  };
}

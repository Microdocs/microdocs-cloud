
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';

import { RestClient } from './rest-client';
import { Parameter } from '../http/parameter';
import { Request } from '../http/request';
import { Response } from '../http/response';
import { HttpConfigurationException } from '../exception/http-configuration-exception'
import { RequestBuilder } from '../builder/request-builder';
import { DefaultConfiguration } from '../builder/default-configuration';

export function methodBuilder(method: number) {
  return function (url: string) {
    return function (target: RestClient, propertyKey: string, descriptor: any) {
      let pathParameters: Parameter[] = (<any>target)[`${propertyKey}_Path_parameters`];
      let queryParameters: Parameter[] = (<any>target)[`${propertyKey}_Query_parameters`];
      let bodyParameters: Parameter[] = (<any>target)[`${propertyKey}_Body_parameters`];
      let headers: Parameter[] = (<any>target)[`${propertyKey}_Header_parameters`];

      descriptor.value = function (...args: any[]) {
        let request: Request = new Request();
        request.method = method;
        request.path = url;
        if (this.getBaseUrl() != null) {
          var baseUrl = this.getBaseUrl();
          if (baseUrl.indexOf("/") == baseUrl.length - 1 && url.indexOf("/") == 0) {
            baseUrl = baseUrl.substring(0, 1);
          }
          url = baseUrl + url;
        }
        request.url = url;

        // Body
        if (bodyParameters) {
          if (bodyParameters.length > 1) {
            throw new HttpConfigurationException("Only one @Body is allowed");
          }
          let bodyParam = bodyParameters[0];
          let value = args[bodyParam.parameterIndex];
          if (value === undefined && bodyParam.value !== undefined) {
            value = bodyParam.value;
          }
          request.body = value;
        }

        // Path
        if (pathParameters) {
          for (let k in pathParameters) {
            if (pathParameters.hasOwnProperty(k)) {
              let pathParam = pathParameters[k];
              let value: any = args[pathParam.parameterIndex];
              if (value === undefined && pathParam.value !== undefined) {
                value = pathParam.value;
              }
              request.pathParameters.append(new Parameter({
                name: pathParam.name,
                value: value,
                format: pathParam.format,
                parameterIndex: pathParam.parameterIndex
              }));
            }
          }
        }

        // Query
        if (queryParameters) {
          queryParameters
            .filter((param: any) => args[param.parameterIndex] !== undefined || param.value !== undefined) // filter out optional parameters
            .forEach((param: any) => {
              let name = param.name;
              let value: any = args[param.parameterIndex];
              if (value === undefined && param.value !== undefined) {
                value = param.value;
              }
              request.queryParameters.append(new Parameter({
                name: param.name,
                value: value,
                format: param.format,
                parameterIndex: param.parameterIndex
              }));
            });
        }

        // Headers
        // set class default headers
        if (this.getDefaultHeaders()) {
          for (let key in this.getDefaultHeaders()) {
            let headerParam = new Parameter({name: key, value: this.getDefaultHeaders()[key]});
            request.headers.append(headerParam);
          }
        }
        // set method specific headers
        for (let key in descriptor.headers) {
          if (descriptor.headers.hasOwnProperty(key)) {
            let headerParam = new Parameter({name: key, value: descriptor.headers[key]});
            request.headers.append(headerParam);
          }
        }
        // set parameter specific headers
        if (headers) {
          for (let key in headers) {
            if (headers.hasOwnProperty(key)) {
              let header = headers[key];
              let value: any = args[header.parameterIndex];
              if (value === undefined && header.value !== undefined) {
                value = header.value;
              }
              request.headers.append(new Parameter({
                name: header.name,
                value: value,
                format: header.format,
                parameterIndex: header.parameterIndex
              }));
            }
          }
        }

        if(descriptor.retries){
          request.retries = descriptor.retries;
        }

        let response:Observable<Response> = this.getRequestBuilder().request(request);

        // transform the observable in accordance to the @Produces decorator
        if (descriptor.mime) {
          response = response.map(descriptor.mime);
        }
        if (descriptor.mappers) {
          descriptor.mappers.forEach((mapper: (resp: any) => any) => {
            response = response.map(mapper);
          });
        }
        if (descriptor.emitters) {
          descriptor.emitters.forEach((handler: (resp: Observable<any>) => Observable<any>) => {
            response = handler(response);
          });
        }

        return response;
      };

      return descriptor;
    };
  };
}

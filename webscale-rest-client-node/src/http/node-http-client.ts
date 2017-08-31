import {Client} from 'node-rest-client';
import {Observable} from 'rxjs/Observable';
import {
  HttpClient,
  Request,
  Response,
  Configuration,
  Parameter,
  RequestBuilder,
  HttpException,
  HttpServerException,
  HttpClientException
} from '@webscale/rest-client';

/**
 * HttpClient implementation with NodeJS http client
 */
export class NodeHttpClient implements HttpClient {

  public request(request: Request, configuration: Configuration): Observable<Response> {
    return Observable.create(observer => {
      let response = new Response({request: request});
      let client = new Client();

      // Prepare headers
      let rawHeaders = {};
      request.headers.forEach(header => rawHeaders[header.name] = header.value);

      // Prepare request
      let args = {
        data: request.body,
        headers: rawHeaders,
        requestConfig: {
          timeout: request.timeout
        },
        responseConfig: {
          timeout: request.timeout
        }
      };

      // Error handling
      client.on('error', (err) => {
        observer.error(err);
        observer.complete();
      });

      // Make request
      client[request.method.toLowerCase()](request.url, args, (data, resp) => {
        // Map response
        response.original = resp;
        response.body = data;
        response.status = resp.statusCode;
        if (resp.headers) {
          for (let key in resp.headers) {
            response.headers.append(new Parameter({name: key, value: resp.headers[key]}));
          }
        }

        if (RequestBuilder.isResponseSuccessful(response.status)) {
          // Return observable
          observer.next(response);
          observer.complete();
        } else {
          // Http error
          let error;
          if (response.status >= 500) {
            error = new HttpServerException(response);
          } else if (response.status >= 400) {
            error = new HttpClientException(response);
          } else {
            error = new HttpException(response);
          }
          observer.error(error);
          observer.complete();
        }

      }).on('error', (err) => {
        // Handle http error
        observer.error(err);
        observer.complete();
      });
    });
  }

}

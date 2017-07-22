
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { HttpClient, Request, Response, Configuration, Parameter } from '@webscale/rest-client';
import { RequestOptions, Headers, Request as AngularRequest, Response as AngularResponse, Http } from "@angular/http";
import { Injectable } from "@angular/core";

/**
 * HttpClient implementation with Angular 2
 */
@Injectable()
export class Angular2HttpClient implements HttpClient {

  constructor(private http:Http){}

  request( request: Request, configuration: Configuration ): Observable<Response> {
    let response = new Response( { request: request } );

    // Prepare request
    let headers = new Headers();
    request.headers.forEach(header => {
      headers.set(header.name, header.value);
    });
    let options = new RequestOptions({
      method: request.method,
      url: request.url,
      headers: headers,
      body: request.rawBody
    });
    let req = new AngularRequest(options);

    // Send request
    let resp = this.http.request(req);

    // Map response
    return resp.map(resp => {
      response.rawBody = resp.text();
      response.status = resp.status;
      resp.headers.forEach((values, name) => {
        let param = new Parameter( { name: name, value: values } );
        response.headers.append( param );
      });
      return response;
    });
  }

}

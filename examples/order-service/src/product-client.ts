import { RestClient, HttpClient, Client, Get, Configuration } from '@microdocs/cloud-rest-client';
import { NodeHttpClient } from '@microdocs/cloud-rest-client-node';
import { Observable } from "rxjs/Observable";
import { Product } from "./product";
import { ClientConfiguration } from "./client-configuration";

@Client( {
  baseUrl: '/api/v1',
  serviceId: 'product-service',
  configuration: <Configuration>{
    httpClient: new NodeHttpClient()
  }
} )
export class ProductClient extends RestClient {

  @Get( "/products" )
  public getProducts(): Observable<Product[]> {
    return null;
  }

}

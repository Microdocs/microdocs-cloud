import { RestClient, HttpClient, Client, Get } from '@microdocs/cloud-rest-client';
import { Observable } from "rxjs/Observable";
import { Product } from "./product";
import { ClientConfiguration } from "./client-configuration";

@Client( {
  baseUrl: '/api/v1',
  serviceId: 'product-service',
  configuration: ClientConfiguration
} )
export class ProductClient extends RestClient {

  @Get( "/products" )
  public getProducts(): Observable<Product[]> {
    return null;
  }

}

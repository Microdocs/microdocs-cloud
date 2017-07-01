import { RestClient, HttpClient, Client, Get, Configuration, Produces, MediaType } from '@microdocs/cloud-rest-client';
import { NodeHttpClient } from '@microdocs/cloud-rest-client-node';
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
  @Produces(MediaType.JSON)
  public getProducts(): Observable<Product[]> {
    return null;
  }

}

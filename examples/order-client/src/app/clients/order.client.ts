import { Inject, Injectable } from "@angular/core";
import { RestClient, HttpClient, Get, Path, Client, Retry, MediaType, Produces} from "@microdocs/cloud-rest-client";
import { Observable } from "rxjs/Observable";

import { Order } from "../domain/order.model";
import { ClientConfiguration } from "./client.configuration";

@Injectable()
@Client({
  serviceId: 'order-service',
  configuration: ClientConfiguration
})
export class OrderClient extends RestClient {

  constructor( @Inject("HttpClient") httpClient: HttpClient ) {
    super( httpClient );
  }

  @Get( "/api/v1/orders/{id}" )
  @Produces(MediaType.JSON)
  public getOrder( @Path( 'id' ) id: number ): Observable<Order> {
    return null;
  }

}




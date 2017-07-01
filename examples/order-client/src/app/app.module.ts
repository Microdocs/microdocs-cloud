import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OrderClient } from "./clients/order.client";
import { HttpModule } from "@angular/http";
import { Angular2HttpClient } from "@microdocs/cloud-rest-client-angular2";

@NgModule( {
  declarations: [
    AppComponent
  ],
  imports: [
    HttpModule,
    BrowserModule
  ],
  providers: [
    { provide: "HttpClient", useClass: Angular2HttpClient },
    OrderClient
  ],
  bootstrap: [ AppComponent ]
} )
export class AppModule {
}

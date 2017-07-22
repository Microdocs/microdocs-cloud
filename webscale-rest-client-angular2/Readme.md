# WebscaleJS REST Client Angular 2

**Angular 2** implementation for [WebscaleJS REST Client](https://github.com/WebscaleJS/webscale/tree/master/webscale-rest-client)

## Installation
```
npm install --save @webscale/rest-client-angular2
```

## Usage

You can provide the `Angular2HttpClient` in two ways.

### 1. Provide in the constructor of the RestClient

```ts

import {Http} from '@angular/http';
import {Injectable} from '@angular/core';

import {HttpClient, RestClient, Client, Get, Put, Post, Delete, Headers, Path, Body, Query, Produces, MediaType} from '@webscale/rest-client';
import {Angular2HttpClient} from '@webscale/rest-client-angular2';

@Injectable()
@Client({
    serviceId: 'todo-service'
})
export class TodoClient extends RestClient {

  constructor(http:Http){
      super(new Angular2HttpClient(http));
  }
  
...  
```

### 2. Provide in the modules definition

**app.module.ts**
```ts

import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from "@angular/http";
import { NgModule } from '@angular/core';

import { Angular2HttpClient } from "@webscale/rest-client-angular2";

import { TodoClient } from "./todo.client";

@NgModule( {
  declarations: [],
  imports: [
    HttpModule,
    BrowserModule
  ],
  providers: [
    { provide: "HttpClient", useClass: Angular2HttpClient },
    TodoClient
  ],
  bootstrap: [ AppComponent ]
} )
export class AppModule {
}


...
```
**todo.client.ts**
```ts

import {Http} from '@angular/http';
import {Injectable, Inject} from '@angular/core';

import {HttpClient, RestClient, Client, Get, Put, Post, Delete, Headers, Path, Body, Query, Produces, MediaType} from '@webscale/rest-client';
import {Angular2HttpClient} from '@webscale/rest-client-angular2';

@Injectable()
@Client({
    serviceId: 'todo-service'
})
export class TodoClient extends RestClient {

  constructor(@Inject('HttpClient') httpClient:HttpClient){
      super(httpClient);
  }

...
```

## Licence

MIT

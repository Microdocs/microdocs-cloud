# WebscaleJS REST Client NodeJS

**NodeJS Http** implementation for [Webscale REST Client](https://github.com/Webscale-Architecture/WebscaleJS/tree/master/webscale-rest-client)

## Installation
```
npm install --save @webscale/rest-client-node
```

## Usage

You can provide the `NodeRestClient` in two ways.

### 1. Provide the `NodeRestClient` in the constructor of the RestClient

```ts

import {HttpClient, RESTClient, Client, GET, PUT, POST, DELETE, Headers, Path, Body, Query, Produces, MediaType} from '@webscale/rest-client';
import {NodeHttpClient} from '@webscale/rest-client-node';

@Client({
    serviceId: 'todo-service'
})
export class TodoClient extends RestClient {

  constructor(){
      super(new NodeHttpClient());
  }
  
...  
```

### 2. Provide the `NodeRestClient` in the configuration class

```ts

import {HttpClient, RESTClient, Client, GET, PUT, POST, DELETE, Headers, Path, Body, Query, Produces, MediaType} from '@webscale/rest-client';
import {NodeHttpClient} from '@webscale/rest-client-node';

@Client({
    serviceId: 'todo-service',
    configuration: <Configuration>{
     httpClient: new NodeHttpClient()
   }
})
export class TodoClient extends RestClient {

...
```

## Licence

MIT

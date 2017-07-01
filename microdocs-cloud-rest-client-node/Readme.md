# MicroDocs Cloud REST Client NodeJS

**NodeJS Http** implementation for [MicroDocs Cloud REST Client](https://github.com/Microdocs/microdocs-cloud/tree/master/microdocs-cloud-rest-client)

## Installation
```
npm install --save @microdocs/cloud-rest-client-node
```

## Usage

You can provide the `NodeRestClient` in two ways.

### 1. Provide in the constructor of the RestClient

```ts

import {HttpClient, RESTClient, Client, GET, PUT, POST, DELETE, Headers, Path, Body, Query, Produces, MediaType} from '@microdocs/cloud-rest-client';
import {NodeHttpClient} from '@microdocs/cloud-rest-client-node';

@Client({
    serviceId: 'todo-service'
})
export class TodoClient extends RestClient {

  constructor(){
      super(new NodeHttpClient());
  }
  
...  
```

### 2. Provide in the configuration class

```ts

import {HttpClient, RESTClient, Client, GET, PUT, POST, DELETE, Headers, Path, Body, Query, Produces, MediaType} from '@microdocs/cloud-rest-client';
import {NodeHttpClient} from '@microdocs/cloud-rest-client-node';

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

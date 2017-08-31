# Webscale REST Client

Webscale REST Client is a lightweight universal framework for to make REST clients. 
The purpose behind this project is to make a **Resilient System** for NodeJS and Web applications.
Everything is build with an abstraction layer, so you can plugin your own implementation to customize it.
This framework is part of the [WebscaleJS Framework](https://github.com/Webscale-Architecture/WebscaleJS).

## Features
* [Declarative Typescript REST client with decorators](#declarative-typescript-rest-client)
* [Client-side loadbalancer framework](#client-side-loadbalancing)
* [Connect with Service Discovery](#service-discovery)
* [Create Resilient systems with Retries](#retry)
* [Abstract Http clients (NodeJS and Web compatible)](#abstract-http-client)
* Request Builder
* Object serializers

## Installation
```sh
npm install --save @webscale/rest-client
```

## <a name="declarative-typescript-rest-client"></a>Declarative Typescript REST client with decorators
This library enables to write REST clients in a declarative way with Typescript. A request can be defined with decorators (see the example below). 
### Example
```ts

import {HttpClient, RESTClient, Client, GET, PUT, POST, DELETE, Headers, Path, Body, Query, Produces, MediaType} from '@webscale/rest-client';
import {Todo} from './models/Todo';
import {SessionFactory} from './sessionFactory';

@Client({
    serviceId: 'todo-service',
    baseUrl: '/api',
    headers: {
        'content-type': 'application/json'
    }
})
export class TodoClient extends RestClient {

    constructor(httpClient:HttpClient){
        super(httpClient);
    }

    protected requestInterceptor(req: Request):void {
        if (SessionFactory.getInstance().isAuthenticated) {
            req.headers.append('jwt', SessionFactory.getInstance().credentials.jwt);
        }
    }
    
    protected responseInterceptor(res: Observable<Response>): Observable<any> {
        // do anything with responses
        return res;
    }

    @Get("todo/")
    @Produces(MediaType.JSON)
    public getTodos( @Query("page") page:number, @Query("size", {default: 20}) size?:number, @Query("sort") sort?: string): Observable<Todo[]> { return null; };

    @Get("todo/{id}")
    @Map(resp => new Todo(resp.json()))
    public getTodoById( @Path("id") id: number): Observable<Todo>{ return null; };

    @Post("todo")
    @Headers({
        'content-type': 'application/json'
    })
    public postTodo( @Body todo: Todo): Observable<Response> { return null; };

    @Put("todo/{id}")
    public putTodoById( @Path("id") id: string, @Body todo: Todo): Observable<Response> { return null; };

    @Delete("todo/{id}")
    public deleteTodoById( @Path("id") id: string): Observable<Response> { return null; };

}
```

## <a name="client-side-loadbalancing"></a>Client-side Loadbalancing Framework

This REST client comes with a lightweight loadbalancing framework. 
This frameworks enables to loadbalance a requests over multiple servers and [retry](#retry) if it failed.

A **ServerList** provides a list of available servers to the loadbalancer. 
This list can contains static server addresses, but can also be connected to a Service Discovery. The ServerList will be updated every 2.5 seconds

The **LoadbalancerRule** is used to pick the next available server from the ServerList. This can be done using loadbalancing algorithms like Round Robin. 
With **LoadbalancerFilters** the servers in the ServerList can be filtered, so that only a subset of the servers is presented to the LoadbalancerRule.
 
## <a name="service-discovery"></a>Connect with a Service Discovery

The **ServerList** offers the ability to fetch available servers from a Service Discovery registry, like [Eureka](https://github.com/Netflix/eureka) or [Zookeeper](https://zookeeper.apache.org/).

To make an own implementation, the ```ServerList#updateServerList``` can be overwritten. 
This function is called every periodically, so this is useful for fetching the server list.
 
## <a name="retry"></a>Create Resilient systems with Retries

This loadbalancer comes out of the box with a retry function.
This function will retry a request a few time if it has failed.
With each retry a new available server instance is fetched from the loadbalancer, so each retry will go to a different instance (if they are present).
With this mechanise a resilient system is created, where a fault is prevented to become a failure.

## <a name="abstract-http-client"></a>Abstract Http clients (NodeJS and Web compatible)

With an abstraction layer for the HTTP clients, it is possible to use a custom implementation for it.
There are also implementation that are ready to use:
* [NodeJS](https://github.com/Webscale-Architecture/WebscaleJS/tree/master/webscale-rest-client-node)
* [Angular 2](https://github.com/Webscale-Architecture/WebscaleJS/tree/master/webscale-rest-client-angular2)

# API Docs

### `RestClient`

Declarative REST Client

#### Constructors:
- `constructor(httpClient?: HttpClient)` - Initialize a RestClient with a `HttpClient` implementation (see [Abstract Http clients](#abstract-http-client))

#### Methods:
- `getServiceId(): string` - returns the serviceId of the RestClient
- `getBaseUrl(): string` - returns the base url of RestClient
- `getDefaultHeaders(): Object` - returns the default headers of RestClient in a key-value pair
- `getConfiguration(): Configuration` - returns the `Configuration` object specified in the `@Client` decorator above the class
- `getHttpClient(): HttpClient` - returns the `HttpClient` that is used to make requests
- `getRequestBuilder(): RequestBuilder` - returns the `RequestBuilder` instance that is used to build up the requests

### `Configuration`

Configuration options for the RestBuilder

#### Properties

- `httpClient?: HttpClient` - Used to make the Http request
- `retries?: number` - How many times a Http request should be retried before failing.
- `timeout?: number` - Read and connection timeout for the Http request

- `requestInterceptors?: RequestInterceptor[]` - Interceptor which is called just before making the Http request
- `responseInterceptors?: ResponseInterceptor[]` - Interceptor which is called just after the Http call is made

- `bodyObjectMapper?: ObjectMapper` - Http Body serializer and deserializer
- `queryObjectMapper?: ParameterObjectMapper` - Http query parameters serializer and deserializer
- `pathObjectMapper?: ParameterObjectMapper` - Http path parameters serializer and deserializer
- `headerObjectMapper?: ParameterObjectMapper` - Http header parameters serializer and deserializer

- `serverList?: new ( serviceName: string ) => ServerList` - List of available servers which are used for loadbalancing
- `loadbalancerRule?: LoadbalancerRule` - Loadbalancer algorithm, default is the `RoundRibbonRule`
- `loadbalancerFilters?: LoadbalancerFilter[]` - Filter the `ServerList` just before the are passed to the `LoadbalancerRule`

### Class decorators:
- `@Client(args:{serviceId?: string, baseUrl?: string, headers?: any, configuration?: Configuration|(new () => Configuration)})`

### Method decorators:
- `@Get(url: String)`
- `@Post(url: String)`
- `@Put(url: String)`
- `@Patch(url: String)`
- `@Delete(url: String)`
- `@Head(url: String)`
- `@Headers(headers: Object)`
- `@Map(mapper:(resp : any)=>any)`
- `@OnEmit(emitter:(resp : Observable<any>)=>Observable<any>)`
- `@Retry(retries: number)`

### Parameter decorators:
- `@Path(name: string, value?:any|{value?:any})`
- `@Query(name: string, value?:any|{value?:any,format?:string})`
- `@Header(name: string, value?:any|{value?:any,format?:string})`
- `@Body`

#### Collection Format
Determines the format of the array if type array is used. (used for ``@Query`` and ``@Header``) Possible values are:
* ``Format.CSV`` - comma separated values ``foo,bar``.
* ``Format.SSV`` - space separated values ``foo bar``.
* ``Format.TSV`` - tab separated values ``foo\tbar``.
* ``Format.PIPES`` - pipe separated values ``foo|bar``.
* ``Format.MULTI`` - corresponds to multiple parameter instances instead of multiple values for a single instance ``foo=bar&foo=baz``. This is valid only for parameters in "query" or "formData".

Default value is ``Format.CSV``.

## Licence

MIT

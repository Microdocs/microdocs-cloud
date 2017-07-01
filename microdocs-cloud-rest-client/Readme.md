# MicroDocs Cloud REST Client

MicroDocs Cloud REST Client is a lightweight universal framework for REST clients, to make **resilient MicroServices**.
Everything is build with an abstraction layer, so you can plugin your own implementation to customize it.

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
npm install --save @microdocs/cloud-rest-client
```

## <a name="declarative-typescript-rest-client"></a>Declarative Typescript REST client with decorators
This library enables to write REST clients in a declarative way with Typescript. A request can be defined with decorators (see the example below). 
### Example
```ts

import {HttpClient, RESTClient, Client, GET, PUT, POST, DELETE, Headers, Path, Body, Query, Produces, MediaType} from '@microdocs/cloud-rest-client';
import {Todo} from './models/Todo';
import {SessionFactory} from './sessionFactory';

@Injectable()
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
* [NodeJS](https://github.com/Microdocs/microdocs-cloud/tree/master/microdocs-cloud-rest-client)

## Licence

MIT

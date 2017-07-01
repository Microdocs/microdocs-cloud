import { Configuration, ServerList, Server, HttpClient } from '@microdocs/cloud-rest-client';
import { NodeHttpClient } from '@microdocs/cloud-rest-client-node';

export const ClientConfiguration: Configuration = {

  httpClient: new NodeHttpClient(),

  serverList: ServerList.from( {
    'product-service': [
      {
        host: 'product-service',
        port: 3000
      }
    ]
  } ),
  timeout: 1000

};

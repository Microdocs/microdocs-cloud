import { DefaultConfiguration, ServerList, Server, HttpClient } from '@microdocs/cloud-rest-client';
import { NodeHttpClient } from '@microdocs/cloud-rest-client-node';

export class ClientConfiguration extends DefaultConfiguration {

  httpClient: HttpClient = new NodeHttpClient();

  serverList = ServerList.from({
    'product-service': [
      {
        host: 'product-service',

      }
    ]
  });
  timeout = 1000;

}

export class ClientServerList extends ServerList {

  initializeServerList() {
    console.info("[" + this.serviceName + "] init serverlist");
    switch ( this.serviceName.toLowerCase() ) {

      case 'product-service':
        this._servers = [
          new Server({
            ip: "product-service",
            port: 3000,
            serviceName: 'product-service',
            instanceName: 'product-service-1',
            available: true
          })
        ];
        break;

      default:
        this._servers = [];
    }
  }

}

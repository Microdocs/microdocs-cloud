import { Configuration, ServerList } from '@microdocs/cloud-rest-client';

export const ClientConfiguration:Configuration = {

  retries: 3,
  serverList: ServerList.from({
    'order-service': [
      {
        host: 'localhost',
        port: 3000
      }
    ]
  })

};

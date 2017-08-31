import "reflect-metadata"; // this shim is required
import { createExpressServer } from "routing-controllers";
import { Configuration, App } from '@webscale/boot';
import { LoggerFactory } from '@webscale/logging';

import { EventController } from "../controllers/event.controller";

const logger = LoggerFactory.create("webscale.auditlog");

@Configuration
export class WebConfig {

  constructor( app: App ) {
    // Init webserver
    const webServer = createExpressServer({
      controllers: [EventController]
    });

    // Start webserver
    let port = app.properties.getNumber("server.port", 3000);
    logger.info("Listen on port " + port);
    webServer.listen(port);
  }

}

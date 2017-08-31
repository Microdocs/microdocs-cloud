import { Configuration, App } from '@webscale/boot';
import { EventStream, EventStreamOptions } from '@webscale/events';
import { EventService } from "../services/event.service";
import { Connection } from "amqp-ts/lib/amqp-ts";
import {LoggerFactory} from "@webscale/logging";

const logger = LoggerFactory.create("webscale.auditlog");

@Configuration
export class AuditLogConfig {

  constructor(app:App, eventService:EventService) {
    let options : any = app.properties.getObject("amqp") as EventStreamOptions;
    if(!options){
      throw new Error("Missing 'amqp' options");
    }
    if(!options.url){
      options.url = "amqp://localhost";
    }

    logger.info("Connect to AMQP " + options.url);
    let connection = new Connection(options.url);
    let eventStream = new EventStream(connection, options);
    eventStream.subscribe(event => {
      eventService.storeEvent(event);
    });
  }

}

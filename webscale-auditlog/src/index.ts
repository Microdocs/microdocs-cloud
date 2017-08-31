import { App } from '@webscale/boot';
import { AuditLogConfig } from "./config/auditlog.config";
import { WebConfig } from "./config/web.config";
import { EventService } from "./services/event.service";
import { DatabaseConfig } from "./config/database.config";
import { EventRepository } from "./repositories/event.repo";
import { EventPublisher, Event } from "@webscale/events";
import { Connection } from "amqp-ts";

// Init app
const app = new App()
  .loadYamlFile(__dirname + "/application.yml")
  .service(EventRepository, "EventRepository")
  .service(EventService, "EventService")
  .config(DatabaseConfig)
  .config(AuditLogConfig)
  .config(WebConfig)
  .start().then(() => {
  setTimeout(() => {
    console.info("Send message");
    let publisher = new EventPublisher("mybus", new Connection("amqp://eventbus"));
    publisher.send(new Event({
      routingKey: "webscale.test",
      body: { say: "hello"}
    }));
  }, 1000);
});








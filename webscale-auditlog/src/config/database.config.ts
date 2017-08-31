
import {Configuration, App} from "@webscale/boot";
import {LoggerFactory} from "@webscale/logging";
import * as mongoose from "mongoose";

const logger = LoggerFactory.create("@webscale/auditlog");

@Configuration
export class DatabaseConfig {

  constructor(app:App){
    let url = app.properties.getString("mongodb.url", "mongodb://localhost/auditlog");
    mongoose.connect(url).then(() => {
      logger.info("Connected to MongoDB (" + url + ")");
    }).catch((err) => {
      logger.error("Failed to connect to MongoDB (" + url + ")", err);
    });
  }

}

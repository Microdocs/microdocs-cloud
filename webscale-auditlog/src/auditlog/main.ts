import { App } from '@webscale/boot';
import { LoggingFactory } from '@webscale/logging';
import { AuditLogConfig } from "./auditlog-config";

// Init app
const app = new App();

// Load properties
app.loadYamlFile(__dirname + "/../application.yml");

// Configure logger
const logger = LoggingFactory.create();
LoggingFactory.configure(app.properties.getObject("logger") || {});

// Define Config
app.config(AuditLogConfig);

// Define Services


// Start application
app.start();

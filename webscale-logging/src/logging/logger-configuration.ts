import { LogLevel } from "./log-level";

/**
 * Configuring loggers
 */
export interface LoggerConfiguration extends LogConfiguration{

  /**
   * Configure each logger
   */
  loggers?: { [namespace: string]: LogLevel | LogConfiguration };

}

/**
 * Configure a logger
 */
export interface LogConfiguration {

  /**
   * Loglevel for the logger
   */
  level?: LogLevel;

  /**
   * Custom configuration for a logger
   */
  config?: any;

}

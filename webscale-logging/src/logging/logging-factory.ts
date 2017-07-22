import { Logger } from "./logger";
import { LoggerAdapter } from "./logger-adapter";
import { LogLevel, parseLevel } from "./log-level";
import { LoggerConfiguration } from "./logger-configuration";
import { ConsoleLoggerAdapter } from "./console/console-logger-adapter";

/**
 * Factory for creating and managing loggers
 */
export class LoggingFactory {

  private static loggerAdapter: LoggerAdapter = new ConsoleLoggerAdapter();
  private static config: LoggerConfiguration;

  /**
   * Create new Logger instance
   * @param namespace
   * @return {Logger}
   */
  public static create( namespace?: string ): Logger {
    let logger = this.loggerAdapter.createLogger( namespace );
    if ( this.config ) {
      LoggingFactory.applyConfig( logger, this.config );
    }
    return logger;
  }

  /**
   * Remove logger
   * @param namespace
   */
  public static remove( namespace?: string ): void {
    this.loggerAdapter.removeLogger( namespace );
  }

  /**
   * Get all registered loggers
   * @param namespace filter on namespace
   * @return {Logger[]}
   */
  public static getLoggers( namespace?: string ): Logger[] {
    let loggers = this.loggerAdapter.list();
    if ( namespace ) {
      loggers = loggers.filter( logger => logger.namespace === namespace );
    }
    return loggers;
  }

  /**
   * Set loglevel of all matching loggers
   * @param logLevel
   * @param namespace filter on namespace
   */
  public static setLevel( logLevel: LogLevel, namespace?: string ): void {
    LoggingFactory.getLoggers( namespace ).forEach( logger => {
      logger.setLevel( logLevel );
    } );
  }

  /**
   * Configure loggers
   * @param config
   */
  public static configure( config: LoggerConfiguration ): void {
    this.config = config;
    this.getLoggers().forEach( logger => LoggingFactory.applyConfig( logger, config ) );
  }

  /**
   * Apply config to logger
   * @param logger
   * @param config
   */
  private static applyConfig( logger: Logger, config: LoggerConfiguration ): void {
    if ( config.level !== undefined ) {
      try{
        logger.setLevel(parseLevel(config.level));
      }catch(e){
        console.error(e.message);
      }
    }
    if ( config.config ) {
      logger.configure( config.config );
    }
    if ( config.loggers && logger.namespace && config.loggers[ logger.namespace ] !== undefined ) {
      let subConfig = config.loggers[ logger.namespace ];
      if ( typeof(subConfig) === 'object' ) {
        logger.configure( subConfig );
      } else {
        try{
          logger.setLevel(parseLevel(config.level));
        }catch(e){
          console.error(e.message);
        }
      }
    }
  }

  /**
   * Set the logger adapter
   * @param loggerAdapter
   */
  public static setAdapter( loggerAdapter: LoggerAdapter | (new () => LoggerAdapter) ): void {
    if ( typeof(loggerAdapter) === 'function' ) {
      this.loggerAdapter = new loggerAdapter();
    } else {
      this.loggerAdapter = loggerAdapter;
    }
  }

  /**
   * Get the logger adapter
   * @return {LoggerAdapter}
   */
  public static getAdapter(): LoggerAdapter {
    return this.loggerAdapter;
  }

}

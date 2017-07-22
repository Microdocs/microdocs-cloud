import { Logger } from "../logger";
import { LogLevel } from "../log-level";
import { LogConfiguration } from "../logger-configuration";

/**
 * Console logger
 */
export class ConsoleLogger extends Logger {

  private logLevel: LogLevel = LogLevel.info;

  constructor(namespace?:string) {
    super(namespace);
  }

  public log( level: LogLevel, message?: any, ...optionalParams: any[] ): void {
    switch ( level ) {
      case LogLevel.silly:
        this.silly( message, optionalParams );
        return;
      case LogLevel.debug:
        this.debug( message, optionalParams );
        return;
      case LogLevel.verbose:
        this.verbose( message, optionalParams );
        return;
      case LogLevel.info:
        this.info( message, optionalParams );
        return;
      case LogLevel.warn:
        this.warn( message, optionalParams );
        return;
      case LogLevel.error:
        this.error( message, optionalParams );
        return;
      default:
        throw new Error( "Invalid log level: " + level );
    }
  }

  public silly( message?: any, ...optionalParams: any[] ): void {
    if ( this.shouldLog( LogLevel.silly ) ) {
      console.info( "silly: " + message, ...optionalParams );
    }
  }

  public debug( message?: any, ...optionalParams: any[] ): void {
    if ( this.shouldLog( LogLevel.debug ) ) {
      console.info( "debug: " + message, ...optionalParams );
    }
  }

  public verbose( message?: any, ...optionalParams: any[] ): void {
    if ( this.shouldLog( LogLevel.verbose ) ) {
      console.info( "verbose: " + message, ...optionalParams );
    }
  }

  public info( message?: any, ...optionalParams: any[] ): void {
    if ( this.shouldLog( LogLevel.info ) ) {
      console.info( "info: " + message, ...optionalParams );
    }
  }

  public warn( message?: any, ...optionalParams: any[] ): void {
    if ( this.shouldLog( LogLevel.warn ) ) {
      console.warn( "warn: " + message,... optionalParams );
    }
  }

  public error( message?: any, ...optionalParams: any[] ): void {
    if ( this.shouldLog( LogLevel.error ) ) {
      console.error( "error: " + message, ...optionalParams );
    }
  }

  public setLevel( logLevel: LogLevel ): void {
    this.logLevel = logLevel;
  }

  public getLevel(): LogLevel {
    return this.logLevel;
  }
  public configureOriginal( config: any ): void {}

}

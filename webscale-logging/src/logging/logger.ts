import { LogLevel } from "./log-level";
import { LogConfiguration } from "./logger-configuration";
/**
 * Logger
 */
export abstract class Logger {

  private readonly _original: any;
  private readonly _namespace?: string;

  /**
   * Create logger
   * @param original original logger
   */
  constructor( namespace?: string, original?: any ) {
    this._namespace = namespace;
    this._original  = original;
  }

  /**
   * Original logger
   * @return {any}
   */
  get original(): any {
    return this._original;
  }

  /**
   * Namespace of the logger
   * @return {string}
   */
  get namespace(): string {
    return this._namespace;
  }

  /**
   * Log message
   * @param level
   * @param message
   * @param meta
   */
  public abstract log( level: LogLevel, message?: any, ...optionalParams: any[] ): void;

  /**
   * Log silly message
   * @param message
   * @param meta
   */
  public abstract silly( message?: any, ...optionalParams: any[] ): void;

  /**
   * Log debug message
   * @param message
   * @param meta
   */
  public abstract debug( message?: any, ...optionalParams: any[] ): void;

  /**
   * Log verbose message
   * @param message
   * @param meta
   */
  public abstract verbose( message?: any, ...optionalParams: any[] ): void;

  /**
   * Log info message
   * @param message
   * @param meta
   */
  public abstract info( message?: any, ...optionalParams: any[] ): void;

  /**
   * Log warning message
   * @param message
   * @param meta
   */
  public abstract warn( message?: any, ...optionalParams: any[] ): void;

  /**
   * Log error message
   * @param message
   * @param meta
   */
  public abstract error( message?: any, ...optionalParams: any[] ): void;

  /**
   * Set the log level
   * @param logLevel
   */
  public abstract setLevel( logLevel: LogLevel ): void;

  /**
   * Get the log level
   */
  public abstract getLevel(): LogLevel;

  /**
   * Check if logger should log for a level
   * @param logLevel
   * @return {boolean}
   */
  public shouldLog( logLevel: LogLevel ): boolean {
    return this.getLevel() <= logLevel;
  }

  /**
   * Configure logger
   * @param config
   */
  public configure( config: LogConfiguration ): void {
    if ( config.level !== undefined ) {
      this.setLevel( config.level );
    }
    if ( config.config ) {
      this.configureOriginal( config.config );
    }
  }

  /**
   * Configure original logger
   * @param config
   */
  public abstract configureOriginal( config: any ): void;
}

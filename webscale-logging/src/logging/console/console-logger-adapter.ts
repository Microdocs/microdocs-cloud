import { LoggerAdapter } from "../logger-adapter";
import { Logger } from "../logger";
import { ConsoleLogger } from "./console-logger";

/**
 * Simple console logger adapter
 */
export class ConsoleLoggerAdapter extends LoggerAdapter {

  private _loggers: { [namespace: string]: ConsoleLogger } = {};

  public createLogger( namespace?: string ): Logger {
    let key = namespace || '_default';
    if(!this._loggers[key]){
      this._loggers[key] = new ConsoleLogger(namespace);
    }
    return this._loggers[key];
  }

  public removeLogger( namespace: string ): void {
    delete this._loggers[namespace];
  }

  public list( namespace?: string ): Logger[] {
    return Object.keys(this._loggers).map(namespace => this._loggers[namespace]);
  }

}

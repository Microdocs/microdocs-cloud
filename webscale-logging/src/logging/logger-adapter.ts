import { Logger } from "./logger";

/**
 * Adapter for a specific logger implementation
 */
export abstract class LoggerAdapter {

  /**
   * Create Logger
   * @param namespace
   * @return {Logger}
   */
  public abstract createLogger( namespace?: string ): Logger;

  /**
   * Remove Logger
   * @param namespace
   */
  public abstract removeLogger(namespace:string): void;

  /**
   * List all loggers
   * @param namespace filter on namespace
   */
  public abstract list(namespace?:string):Logger[];

}

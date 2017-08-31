export const BOOT_TIMESTAMP = new Date();
export let INIT_TIMESAMP: Date = undefined;
export let READY_TIMESAMP: Date = undefined;
export let STARTUP_TIME: number = undefined;

import { Container, Service, Token } from "typedi";
import { LoggerFactory, Logger } from '@webscale/logging';

import { Properties } from "./properties/properties";
import { PropertySource } from "./properties/property-source";

const logger = LoggerFactory.create("webscale.boot");

/**
 * Application bootstrapper
 */
@Service()
export class App {

  private _configClasses: (Function | (new () => any))[] = [];
  private _properties: Properties = new Properties();

  constructor() {
  }

  /**
   * Register configuration object
   * @param config
   */
  public config( config: Function | (new () => any) ): App {
    this._configClasses.push(config);
    return this;
  }

  /**
   * Register configuration objects
   * @param configs list of configuration classes
   */
  public configs( configs: (Function | (new () => any))[] ): App {
    configs.forEach(config => {
      this._configClasses.push(config);
    });
    return this;
  }

  /**
   * Load property sources
   * @param propertySource
   */
  public propertySource( propertySource: PropertySource ): App {
    this._properties.load(propertySource);
    return this;
  }

  /**
   * Load Yaml source
   * @param sourceName
   * @param yaml
   */
  public loadYaml( sourceName: string, yaml: string ): App {
    this._properties.loadYaml(sourceName, yaml);
    return this;
  }

  /**
   * Load Yaml file
   * @param yaml
   */
  public loadYamlFile( yamlFile: string ): App {
    this._properties.loadYamlFile(yamlFile, yamlFile);
    return this;
  }

  /**
   * Get profiles
   * @return {string}
   */
  get profiles(): string[] {
    return this._properties.getArray("application.profiles", []);
  }

  /**
   * Check if profile is active
   * @param profile
   * @return {boolean}
   */
  public isProfileActive( profile: string ): boolean {
    return this.profiles.map(p => p.toLowerCase()).indexOf(profile.toLowerCase()) !== -1;
  }

  /**
   * Get application name
   * @return {string}
   */
  get name(): string {
    return this._properties.getString("application.name", "WebScale App");
  }

  /**
   * Get Properties
   * @return {Properties}
   */
  get properties(): Properties {
    return this._properties;
  }

  /**
   * Start the application
   */
  public async start(): Promise<App> {
    INIT_TIMESAMP = new Date();

    // Init logger
    LoggerFactory.configure(this.properties.getObject("logger") || {});
    logger.info("Starting " + this.name);
    logger.info("Active profiles: " + this.profiles);
    let defaultLogger = LoggerFactory.create();
    Container.provide([{ id: new Token<Logger>(), value: defaultLogger }]);

    // Init configs
    try {
      await this.applyConfigs();
    } catch (e) {
      logger.error(e);
      process.exit(1)
    }

    // Collect startup metrics
    READY_TIMESAMP = new Date();
    STARTUP_TIME = READY_TIMESAMP.getTime() - BOOT_TIMESTAMP.getTime();
    let readyMinutes = (READY_TIMESAMP.getTime() - INIT_TIMESAMP.getTime()) / 1000;
    let startupMinutes = STARTUP_TIME / 1000;
    logger.info("Startup complete in " + readyMinutes + "s (total time: " + startupMinutes + "s)");

    return this;
  }

  /**
   * Apply config classes
   * @param configClass
   */
  private async applyConfigs() {
    for (let i = 0; i < this._configClasses.length; i++) {
      let configClass = this._configClasses[i];

      let name = configClass.name;
      if (configClass.prototype && configClass.prototype.constructor && configClass.prototype.constructor.name) {
        name = configClass.prototype.constructor.name;
      }
      logger.verbose("Apply" + (name ? ": " + name : " config"));

      try {
        let result = new (<(new () => any)>configClass)();
        if (result instanceof Promise) {
          await result;
        } else {
          await Promise.resolve(result);
        }
      } catch (e) {
        await Promise.reject(e);
      }
    }
  }

}

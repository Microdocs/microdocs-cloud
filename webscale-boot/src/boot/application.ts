import { LoggingFactory } from '@webscale/logging';

import { Injections } from "./injections";
import { Properties } from "./properties/properties";
import { PropertySource } from "./properties/property-source";

const logger = LoggingFactory.create( "webscale.boot" );

/**
 * Application bootstrapper
 */
export class App {

  private _configClasses: (Function|(new () => any))[] = [];
  private _properties: Properties               = new Properties();

  /**
   * Register service for dependency injection
   * @param service
   * @param name
   */
  public service( service: Function | Object, name?: string ): void {
    Injections.register( service, name );
  }

  /**
   * Register services for dependency injection
   * @param services list of services
   */
  public services( services: (Function | Object | { name: string, component: Object | Function })[] ): void {
    services.forEach( service => {
      Injections.register( service );
    } );
  }

  /**
   * Register component for dependency injection
   * @param component
   * @param name
   */
  public component( component: Function | Object, name?: string ): void {
    Injections.register( component, name );
  }

  /**
   * Register components for dependency injection
   * @param components list of components
   */
  public components( components: (Function | Object)[] ): void {
    components.forEach( component => {
      Injections.register( component );
    } );
  }

  /**
   * Register configuration object
   * @param config
   */
  public config( config: Function|(new () => any) ): void {
    this._configClasses.push( config );
  }

  /**
   * Register configuration objects
   * @param configs list of configuration classes
   */
  public configs( configs: (Function|(new () => any))[] ): void {
    configs.forEach( config => {
      this._configClasses.push( config );
    } );
  }

  /**
   * Load property sources
   * @param propertySource
   */
  public propertySource( propertySource: PropertySource ) {
    this._properties.load( propertySource );
  }

  /**
   * Load Yaml source
   * @param sourceName
   * @param yaml
   */
  public loadYaml( sourceName: string, yaml: string ) {
    this._properties.loadYaml( sourceName, yaml );
  }

  /**
   * Load Yaml file
   * @param yaml
   */
  public loadYamlFile( yamlFile: string ) {
    this._properties.loadYamlFile( yamlFile, yamlFile );
  }

  /**
   * Get profiles
   * @return {string}
   */
  get profiles(): string[] {
    return this._properties.getArray( "application.profiles", [] );
  }

  /**
   * Check if profile is active
   * @param profile
   * @return {boolean}
   */
  public isProfileActive( profile: string ): boolean {
    return this.profiles.map( p => p.toLowerCase() ).indexOf( profile.toLowerCase() ) !== -1;
  }

  /**
   * Get application name
   * @return {string}
   */
  get name(): string {
    return this._properties.getString( "application.name", "WebScale App" );
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
  public async start() {
    logger.info( "Starting " + this.name );
    logger.info( "Active profiles: " + this.profiles );

    await this.applyConfigs();


  }

  /**
   * Apply config classes
   * @param configClass
   */
  private async applyConfigs( ) {
    for(let i = 0; i < this._configClasses.length; i++){
      let configClass = this._configClasses[i];

      let name = configClass.name;
      logger.verbose( "Apply config" + (name ? ": " + name : "") );

      await new (<(new () => any)>configClass)();
    }
  }

}

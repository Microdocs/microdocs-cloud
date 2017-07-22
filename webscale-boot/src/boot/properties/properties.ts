import * as yaml from 'js-yaml';
import * as fs from 'fs';

import { PropertySource } from "./property-source";
import { ObjectPropertySource } from "./object-property-source";

/**
 * Property store
 */
export class Properties extends PropertySource {

  private _sources: PropertySource[] = [];

  constructor() {
    super( "properties" );
  }

  public getProperty<T extends any>( key: string, defaultValue?: T ): T {
    for ( let i = 0; i < this._sources.length; i++ ) {
      let value = this._sources[ i ].getProperty( key, defaultValue );
      if ( value !== null ) {
        return value;
      }
    }
    return null;
  }

  public load( propertySource: PropertySource ) {
    this._sources.push( propertySource );
  }

  /**
   * Load Yaml source
   * supports multi documents
   * @param sourceName
   * @param yamlString
   */
  public loadYaml( sourceName: string, yamlString: string ) {
    let documents = yaml.safeLoadAll( yamlString, undefined );
    documents.forEach( document => {
      let profile      = document.profiles && document.profiles.active;
      let documentName = sourceName + (profile ? "#" + profile : '');
      let source       = new ObjectPropertySource( documentName, document );
      this._sources.push( source );
    } );
  }

  /**
   * Load Yaml file
   * supports multi documents
   * @param sourceName
   * @param yamlFile
   */
  public loadYamlFile( sourceName: string, yamlFile: string ) {
    let yamlString = fs.readFileSync( yamlFile );
    this.loadYaml( sourceName, yamlString.toString() );
  }

  /**
   * Get Property sources
   * @return {PropertySource[]}
   */
  get sources():PropertySource[]{
    return this._sources;
  }

}


/**
 * HTTP Parameter
 *
 * @export
 * @class Parameter
 */
export class Parameter {

  private _name: string;
  private _value: any;
  private _format: string;
  private _parameterIndex: number;

  constructor(values: { name?: string, value?: any, format?: string, parameterIndex?: number }) {
    if(values){
      this._name = values.name;
      this._value = values.value;
      this._format = values.format;
      this._parameterIndex = values.parameterIndex;
    }
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get value(): any {
    return this._value;
  }

  set value(value: any) {
    this._value = value;
  }

  get format(): string {
    return this._format;
  }

  set format(value: string) {
    this._format = value;
  }

  get parameterIndex(): number {
    return this._parameterIndex;
  }

  set parameterIndex(value: number) {
    this._parameterIndex = value;
  }

}


/**
 * collection Formats
 */
export const Format = {
  /**
   *  comma separated values foo,bar.
   */
  CSV: 'CSV',
  /**
   *  space separated values foo bar.
   */
  SSV: 'SSV',
  /**
   *  tab separated values foo\tbar.
   */
  TSV: 'TSV',
  /**
   *  pipe separated values foo|bar.
   */
  PIPES: 'PIPES',
  /**
   *  corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz.
   *  This is valid only for parameters in "query" or "formData".
   */
  MULTI: 'MULTI',
};


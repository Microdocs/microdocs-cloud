

import {EventStream, EventStreamOptions} from "../event-stream";

/**
 * Decorate class with an EventStream
 * @param {EventStreamOptions} options
 * @returns {<TFunction extends Function>(Target: TFunction) => TFunction}
 * @constructor
 */
export function EventHandler(options:EventStreamOptions) {
  return function <TFunction extends Function>(Target: TFunction): TFunction {
    let stream = new EventStream(options);
    Target.prototype.getStream = function(){
      return stream;
    };
    return Target;
  };
}

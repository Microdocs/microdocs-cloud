

import { EventConnectionOptions } from "../options/event-connection-options";

/**
 * Event Exchange definition
 * @param {EventConnectionOptions} options - Event options options
 */
export function Exchange(options:EventConnectionOptions) {
  return function <TFunction extends Function>(Target: TFunction): TFunction {


    return Target;
  };
}

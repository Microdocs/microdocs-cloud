/**
 * LogLevels
 */
export enum LogLevel {

  off     = 0,
  silly   = 1,
  debug   = 2,
  verbose = 3,
  info    = 4,
  warn    = 5,
  error   = 6

}

/**
 * Parse loglevel string or number
 * @param level
 * @return LogLevel
 */
export function parseLevel( level: string | number ) :LogLevel{
  if(typeof(level) === 'string'){
    switch(level.toLowerCase()){
      case 'off': return LogLevel.off;
      case 'silly': return LogLevel.silly;
      case 'debug': return LogLevel.debug;
      case 'verbose': return LogLevel.verbose;
      case 'info': return LogLevel.info;
      case 'warn': return LogLevel.warn;
      case 'error': return LogLevel.error;
    }
  }else if(typeof(level) === 'number'){
    if(level >= 0 && level <= 6){
      return level;
    }
  }
  throw new Error("Unknown Loglevel: " + level);
}

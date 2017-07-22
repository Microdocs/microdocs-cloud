# WebscaleJS Logging Framework

WebscaleJS Logging is an universal lightweight logger. It provides an abstraction layer over real loggers. 
So vendor locking is prevented, as you can plugin any logger that you want.  

## Features

* [Create and configure logger](#create-and-configure-logger)
* [Various logging implementations](#logging-implementations)
* [Multiple logger](multiple-loggers)

## Installation
```sh
npm install --save @webscale/logging
```

## <a name="create-and-configure-logger"></a>Create and configure logger
```ts
import { LoggerFactory, Logger, LogLevel } from '@webscale/logger';

const logger = LoggerFactory.create();

LoggerFactory.configure({

  // set log level
  level: LogLevel.off
  
});

logger.info("Log Info");
logger.setLevel(LogLevel.debug);
logger.debug("Debug Message");

```

## <a name="logging-implementations"></a>Use a different logger implementation
```ts
import { LoggerFactory, Logger, LogLevel } from '@webscale/logger';
import { WinstonLogger } from '@webscale/logger-winston';

// Define Winston logger
LoggerFactory.setAdapter(WinstonLoggerAdapter);

// Configure logger
LoggerFactory.configure({

  // set log level
  level: LogLevel.debug
  
  // set winston specific config
  config: {
    
  }
  
});

// Create logger
const logger = LoggerFactory.create();


```

## <a name="multiple-loggers"></a>Multiple loggers
```ts
import { LoggerFactory, Logger, LogLevel } from '@webscale/logger';
import { WinstonLogger } from '@webscale/logger-winston';

// Define Winston logger
LoggerFactory.setAdapter(WinstonLoggerAdapter);

// Configure logger
LoggerFactory.configure({

  // set log level
  level: LogLevel.debug
  
  // set winston specific config
  config: {
    
  }
  
});

// Create logger
const logger = LoggerFactory

```

## Licence

MIT

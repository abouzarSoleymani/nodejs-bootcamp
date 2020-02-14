const { createLogger, format, transports } = require("winston");
const winstonMongodb =   require('winston-mongodb');

// @desc    Logs request to console
/*const logger = (req, res, next) => {
  console.log(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
  );
  next();
};*/
// https://github.com/winstonjs/winston#logging
// { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
const level = process.env.LOG_LEVEL || "debug";

function formatParams(info) {
  const { timestamp, level, message, ...args } = info;
  const ts = timestamp.slice(0, 19).replace("T", " ");

  return `${ts} ${level}: ${message} ${Object.keys(args).length
      ? JSON.stringify(args, "", "")
      : ""}`;
}

// https://github.com/winstonjs/winston/issues/1135
const developmentFormat = format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.align(),
    format.printf(formatParams)
);

const productionFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.align(),
    format.printf(formatParams)
);

let logger;

if (process.env.NODE_ENV !== "production") {
  logger = createLogger({
    level: level,
    format: developmentFormat,
    transports: [new transports.Console()]
  });

} else {
  logger = createLogger({
    level: level,
    format: productionFormat,
    transports: [
      new transports.MongoDB({
          db : 'mongodb://localhost:27017/todoList',
          collection : 'logs',
          level : level,
          capped : true
      }),
      new transports.File({ filename: './logs/error.log', level: "error" }),
      new transports.File({ filename: "./logs/combined.log" })
    ]
  });
}

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};

const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const logger = require("./middleware/logger");

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

// Route files
const { bootcamps, courses, auth, users, reviews} = require('./routes');
// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();


const app = express();

const swaggerDefinition = {
    info: {
        title: 'MySQL Registration Swagger API',
        version: '1.0.0',
        description: 'Endpoints to test the user registration routes',
    },
    host: 'localhost:5000',
    basePath: '/api/v1/',
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            scheme: 'bearer',
            in: 'header',
        },
    },
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*'],
};

const swaggerSpec = swaggerJSDoc(options);

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

app.use(require('morgan')("short", { "stream": logger.stream }));

// File uploading
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());


// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.get('/swagger.json', function(req, res) { // line 41
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// ...
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);



const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT, () => {
        logger.info(`Example app listening on port ${PORT}`);
        logger.debug(`More detailed log ${PORT}`);
    }
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  // server.close(() => process.exit(1));
});

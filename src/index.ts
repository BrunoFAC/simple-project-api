/* eslint-disable import/first */
import dotenv from 'dotenv';
import 'express-async-errors';

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });
dotenv.config({ path: './.env' });

// organize-imports-disable-next-line
import bodyParser from 'body-parser';
import router from 'controllers';
import cors from 'cors';
import { StatusCodeEnum } from 'enums/StatusCodeEnum';
import express from 'express';
import expressSwagger from 'express-swagger-generator';

const app = express();
const allowedOrigins = process.env.FE_URL?.split(',').map(o => o.trim());

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        allowedHeaders: ['authorization', 'content-type'],
    }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(router);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, req: any, res: any, next: any) => {
    console.error('\x1b[31m%s\x1b[0m', err.stack);
    res.status(StatusCodeEnum.InternalServerError).send(err);
});

app.listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log('Listening on port', process.env.PORT, '...');
});

if (process.env.NODE_ENV === 'development') {
    const options = {
        swaggerDefinition: {
            info: {
                title: 'FeatureFlags API',
                description: 'API documentation',
                version: '1.0.0',
            },
            host: process.env.HOST,
            basePath: '/',
            produces: ['application/json', 'application/xml'],
            schemes: ['http', 'https'],
            securityDefinitions: {
                JWT: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'authorization',
                    description: '',
                },
            },
        },

        basedir: __dirname, // app absolute path
        files: [
            './interfaces/requests/*.ts',
            './interfaces/dto/*.ts',
            './controllers/**/*.ts',
            './controllers/**/*.js',
        ], // Path to the API handle folder
    };

    expressSwagger(app)(options);
}

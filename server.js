'use strict';

const Hapi = require('hapi');
const Path = require('path');
const Inert = require('inert');

const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'client')
            },
            cors: {
                origin: ['*'],
                additionalHeaders: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match', 'Accept-language']
            }
        }
    }
});

server.connection({
    host: '0.0.0.0',
    port: 8080
});

server.register([
    Inert
], (err) => {
    if (err) {
        throw err;
    }
});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: '.',
            redirectToSlash: true,
            index: true
        }
    }
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at: ' + server.info.uri);
});

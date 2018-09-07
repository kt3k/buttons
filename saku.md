# test
> Runs unit tests

    saku mongo kocha-wait -r -p

# kocha
> Runs [kocha](https://npm.im/kocha) unit test

    npx cross-env MONGODB=mongodb://localhost:27017/test-buttons-backend npx kocha --require src/__tests__/helper.js "src/**/__tests__/*.js"

# kocha-wait
> Runs kocha testing after some delay

    sleep 10
    saku kocha

# mongo
> Prepares mongodb for testing

    docker-compose up

# build
> Builds static site

    npx domaindoc build
    npx bulbo build

# serve-site
> Serves the static site (for local dev)

    npx cross-env API_ROOT=http://localhost:3000 npx bulbo

# serve-api
> Serves the api (for local dev)

    npx cross-env PORT=3000 ALLOW_ORIGIN=http://localhost:7100 node src/index.js

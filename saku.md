# test
> Runs unit tests

    saku mongo kocha-wait -r -p

# kocha
> Runs [kocha](https://npm.im/kocha) unit test

    npx cross-env MONGODB=mongodb://localhost:27017/test-buttons-buckend npx kocha --require src/__tests__/helper.js "src/**/__tests__/*.js"

# kocha-wait
> Runs kocha testing after some delay

    sleep 10
    saku kocha

# mongo
> Prepares mongodb for testing

    docker-compose up

# build
> Builds static site

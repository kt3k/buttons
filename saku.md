# test
> Runs unit tests

    saku mongo kocha-wait -r -p

# kocha
> Runs [kocha](https://npm.im/kocha) unit test

    npx cross-env SKIP_JWT_VERIFY=true MONGODB=mongodb://localhost:27017/test-buttons-backend npx kocha --require api/test-helper.js "domain/**/__tests__/*.js" "api/*.test.js"

# kocha-wait
> Runs kocha testing after some delay

    sleep 10
    saku kocha

# start
> Starts the local dev env

    saku -p -r api website

# mongo
> Prepares mongodb for testing

    docker-compose up

# build
> Builds static site

    npx domaindoc build
    saku disc
    npx bulbo build

# prod-build
> Builds in the production mode

    npx cross-env NODE_ENV=production saku build

# disc
> Creates disc report

    npx cross-env NODE_ENV=production DISC=true npx bulbo build
    mkdir -p build/disc
    npx discify build/index.js > build/disc/index.html

# size
> Builds production bundle and show the size

    npx cross-env BUILD_TARGET=production npx bulbo build
    npx gzip-size build/index.js

# website
> Serves the static site (for local dev)

    npx cross-env API_ROOT=http://localhost:3004 npx bulbo

# api
> Serves the api (for local dev)

    now dev --port 3004

# deploy
> Deploys the server to zeit now

    now --public

# deploy-auto
> Deploys the server to zeit now and update the alias

    now --public
    now alias

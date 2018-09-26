# buttons

https://buttons.kt3k.org/ (nothing yet)

> Daily push buttons

[![CircleCI](https://circleci.com/gh/kt3k/buttons.svg?style=svg)](https://circleci.com/gh/kt3k/buttons)
[![codecov](https://codecov.io/gh/kt3k/buttons/branch/master/graph/badge.svg)](https://codecov.io/gh/kt3k/buttons)

- JAMstack ( https://jamstack.org/ )
- Now ( https://zeit.co/now )
- Auth0 ( https://auth0.com/ )
- MongoDB ( mlab, https://mlab.com/ )
- DDD
- capsid.js ( https://capsid.js.org/ )
- bulbo ( https://github.com/kt3k/bulbo )
- SPA
- docker (for mongodb preparation)
- kocha (testing, mocha clone, https://github.com/kt3k/kocha )
- power-assert ( assertion, https://github.com/power-assert-js/power-assert )
- nyc ( https://github.com/istanbuljs/nyc )
- prettier + husky + lint-staged
- CircleCI ( https://circleci.com/ )
- Codecov ( https://codecov.io/ )

# Domain Models

See [domaindoc](https://kt3k-buttons.netlify.com/domaindoc/).

# Development

## Unit test

Start mongo in a terminal:

```
saku mongo
```

Then in a different console, run tests:

```
saku kocha
```

## Start local server

Start mongo:

```
saku mongo
```

Then in a different console, run the server:

```
saku start
```

This runs local static site and lcoal api server.

# Urls

## / - auth/public

- auth: Your buttons, Your checks
- no auth: Login/Sign up link and list of the users

## /:user - public

- The user's check calendar

## /:user/:date - public

## /settings - auth

- The settings of profile and buttons

## /set-id.html - auth

- The settings of displayId on onboarding steps

## /set-buttons.html - auth

- The settings of buttons on onboarding steps

# APIs

## GET /users/self - auth

- Get the authenticated user

## PUT /users/self/id - auth

- Sets the display

## GET /users/self/buttons - auth

- Gets my buttons

## POST /users/self/buttons - auth

- Create a new button

## PUT /users/self/buttons/:id - auth

- Modify my button

## DELETE /users/self/buttons/:id - auth

- Delete my button

## POST /users/self/buttons/:id/push

- Push a button (create a check of today)

## POST /users/self/buttons/:id/unpush

- Revert a button push

## GET /users - noauth

- Get the users

## GET /checks - auth

- Get my checks

## GET /users/:user/buttons - noauth

- Get the user's button

## GET /users/:user/checks - noauth

- Get the user's checks

## GET /users/:user/checks/?d=YYYY-MM-DD

- Get the user's check by the date

## PUT /buttons/:id/checks/:id

- Modify the check by the id

## DELETE /buttons/:id/checks/:id

- Delete a check by the id

# Use cases

## Onboarding

- Go to /
- Auth0 login
- Go to /set-id.html
- Take displayId
- Go to /set-buttons.html
- Set up 1 - 4 buttons
- Go to /
- Done

## Push button

- Go to / (loggedIn)
- Push buttons
- Done

## Browse my checks

- Go to /checks
- Browse my checks
- Done

## Browse someone's checks

- Go to /users
- See the list of users
- Select the name of a user
- Go to /:user/checks
- See :user's checks
- Done

## Modify my buttons

- Go to /set-buttons.html
- Modify my buttons
- Push save button
- Done

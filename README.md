# 🌱buttons

https://buttons.kt3k.org/

> Daily push buttons

[![CircleCI](https://circleci.com/gh/kt3k/buttons.svg?style=svg)](https://circleci.com/gh/kt3k/buttons)
[![codecov](https://codecov.io/gh/kt3k/buttons/branch/master/graph/badge.svg)](https://codecov.io/gh/kt3k/buttons) [![Greenkeeper badge](https://badges.greenkeeper.io/kt3k/buttons.svg)](https://greenkeeper.io/)

# What is it?

🌱 buttons is a web service to help you keep doing things everyday, especially the things which you tend to forget to do, but is beneficial if you do it everyday. Typical examples are learning language, learning music, workout etc.

The followings are examples of tasks:

- Learn a word in Spanish.
- Learn a Chinese character.
- Read a chapter of Bible.
- Play a piano.
- Work out.

## How to

How to set up tasks in 🌱 buttons? The followings are guidelines:

- Do:
  - Create a task easy to accomplish (in less than 10 min.).
  - Create a creative, constructive task.
  - Create a task easy to start.
  - Revisit the definition of tasks continuously and keep them in reasonable and meaningful state.
- Don't
  - Create a task too difficult to accomplish in a single day. (ex. `Post an blog article` is too difficult. `Write a part of article` is a better alternative.)
  - Create a task hard to keep doing everyday. (ex. `Climb a mountain` if you're not a moutain guide.)
  - Make a (difficult) finish condition. (ex `Win 3 games in row on Splatoon`)

[Let's start!](https://buttons.kt3k.org/)

# High level Architecture

🌱 buttons is a live web service, and its source code, architecture, and documentation are available online on github.

## Infrastructure

- Now ( web server https://zeit.co/now )
- Auth0 ( id https://auth0.com/ )
- mlab ( mongodb as a service https://mlab.com/ )
- Netlify ( static site hosting https://netlify.com/ )

## Archtecture

- JAMstack ( https://jamstack.org/ )
- DDD ( https://en.wikipedia.org/wiki/Domain-driven_design )

## Database

- MongoDB ( https://www.mongodb.com/ )

## Build tools

- docker ( for mongodb preparation https://www.docker.com/ )
- bulbo ( static site generator based on gulp https://github.com/kt3k/bulbo )

## Backend tools

- node.js ( https://nodejs.org/ )
- express ( https://expressjs.com/ )

## Frontend tools

- capsid.js ( component based dom programming https://capsid.js.org/ )
- cal-heatmap ( calendar heatmap https://cal-heatmap.com/ )
- bulma ( css framework https://bulma.io/ )

## datetime

- date-fns ( https://date-fns.org/ )

## Testing

- CircleCI ( https://circleci.com/ )
- Codecov ( coverage SaaS https://codecov.io/ )
- kocha ( test runner, mocha clone https://github.com/kt3k/kocha )
- power-assert ( assertion https://github.com/power-assert-js/power-assert )
- nyc ( coverage https://github.com/istanbuljs/nyc )

## Code quality

- standard ( linter https://standardjs.com/ )
- prettier ( formatter https://prettier.io/ )

## Total Cost

- Free! ✨😎

# Domain Models

See [domaindoc](https://buttons.kt3k.org/domaindoc/).

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

(/profile.html?user=:user)

- The user's check calendar

## /:user/:date - public

(/day.html?user=:user&date=YYYY-MM-DD)

- The user's single day contribution

## /settings - auth

- The settings of profile and buttons

## /set-id.html - auth

- The settings of displayId on onboarding steps

## /settings.html - auth

- The settings of buttons and profile

# APIs

## GET /users/self - auth

- Get the authenticated user

## PUT /users/self - auth

- Modify the authenticated user

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

## POST /users/self/buttons/:id/check

- Check the button

## POST /users/self/buttons/:id/uncheck

- Uncheck the button push

## GET /users - noauth

- Get the users

## GET /users/:id - noauth

- Get the user's profile by the display id

## GET /users/:id/checks?from=YYYY-MM-DD&to=YYYY-MM-DD - noauth

- Get the user's checks in the range of date

## GET /users/:id/checks?d=YYYY-MM-DD - noauth

- Get the user's check by the date

## GET /activities/recent

- Get recent activities.

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
- Go to /settings.html
- Set up 1 - 4 buttons
- Go to /
- Done

## Push button

- Go to / (loggedIn)
- Push buttons
- Done

## Browse my checks

- Go to /
- Browse my checks
- Done

## Browse someone's checks

- Go to /users.html
- See the list of users
- Select the name of a user
- Go to /:user/checks
- See :user's checks
- Done

## Modify my buttons

- Go to /settings.html
- Modify my buttons
- Push save button
- Done

## Modify my profile

- Go to /settings.html
- Modify my profile
- Push save button
- Done

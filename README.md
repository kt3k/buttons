# buttons

> Daily push buttons

https://buttons.kt3k.org

- JAMstack
- Now ( https://zeit.co/now )
- Auth0 ( https://auth0.com/ )
- MongoDB ( mlab, https://mlab.com/ )
- DDD
- capsid.js
- SPA
- bulbo

# Models
## User < Entity
- id: string
- displayId: string
- displayName: string
- buttons: Button[]
## Button < Entity
- id: string
- name: string
- description: string
- user: User
## Check < Entity
- id: string
- date: Date
- note: ?string
- button: Button

# Urls

## / - auth/public

- auth: Your buttons
- no auth: Login/Sign up link and list of calendars of people

## /:user - public

- The user's check calendar

## /:user/:date - public

## /settings - auth

- The settings of buttons

# APIs

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

## POST /buttons/:id/push

- Push a button

## PUT /buttons/:id

- Modify a button

## POST /buttons

- Create a button

## PUT /buttons/:id/checks/:id

- Modify the check by the id

## DELETE /buttons/:id/checks/:id

- Delete a check by the id

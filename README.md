# Mech API
This API is for the Project Mech front-end.

## Tech
Nodejs, Knex, Express, Postgres

## npm i
```
npm i bcryptjs
npm install jsonwebtoken
```

## Routes
auth
```
/login . . . . . . post
/refresh . . . . . . post
```

users
```
/ . . . . . . . . . . . .post
```

cars
```
/ . . . . . . . . . . . . get, post
/:car_id . . . . . . get, delete
```

comments
```
/ . . . . . . . . . . . . get, post
```

dtc
```
/ . . . . . . . . . . . . . . . get
/:dtc_id . . . . . . . . . . . . get
/:dtc_id/comments . . . . . . get
```

vinmake
```
/ . . . . . . . . . . . . get
/:vinmake_id . . . . . . . get
```

## Front-end
https://github.com/peyo/project-mech

## Data
This is a collection of DTC by make and VINs that correspond with world manufacturer identifiers (WMI).
https://github.com/peyo/dtc-and-vin-data

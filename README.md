# Mech API
This API is the back-end for the Project Mech front-end.

## Tech
Nodejs, Knex, Express, Postgres

## npm i
npm i bcryptjs
npm install jsonwebtoken

## Routes
auth
```
/login . . . . . . post
/refresh . . . . . . post
```

users
```
/ . . . . . . post
```

cars
```
/ . . . . . . . . . . . . post
/:car_id . . . . . . get, delete, patch
```

comments
```
/ . . . . . . get
```

dtc
```
/:dtc_id . . . . . . . . . . . . get
/:dtc_id/comments . . . . . . get, delete, patch
```

make
```
/ . . . . . . get
```

vin
```
/ . . . . . . get
```

## Front-end
https://github.com/peyo/project-mech

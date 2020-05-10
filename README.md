# Mech API

This API is the back.end for the Project Mech front-end.

## Routes
auth
```
/login . . . . . . post<br/>
/refresh . . . . . . post
```

users<br/>
└ / ........................ post

cars<br/>
└ / ........................ post<br/>
└ /:car_id ................. get, delete, patch

comments<br/>
└ / ........................ get

dtc<br/>
└ /:dtc_id ................. get<br/>
└ /:dtc_id/comments......... get, delete, patch

make<br/>
└ / ........................ get

vin<br/>
└ / ........................ get

## To front-end
See for more details: https://github.com/peyo/project-mech

## Bug Fix #1
*middleware/auth.js*

- authUser is not verifying JWT, we will need to fix to verify. The safer method to extract the payload from the token is `jwt.verify(token, SECRET_KEY).`
```
function authUser(req, res, next) {
  try {
    const token = req.body._token || req.query._token;
    if (token) {
      // FIX BUG #1 HERE - TOKEN
      let payload = jwt.verify(token, SECRET_KEY);
      req.curr_username = payload.username;
      req.curr_admin = payload.admin;
    }
    return next();
  } catch (err) {
    err.status = 401;
    return next(err);
  }
}

// routes.test.js

// BUG TEST #1
describe("authUser", function () {
  test("should prevent payload from being tampered with", async function () {
    //change u1 token payload and sign with a diff key
    const tamperedToken = jwt.sign(
      { username: "u1", admin: true },
      "wrong-key"
    );
    const response = await request(app)
      .get("/users")
      .send({ _token: tamperedToken });
    expect(response.statusCode).toBe(401);
  });
});
```

## Bug Fix #2
*routes/users/js*
- Route currently denies authorization and access for the CORRECT user, and right now, it only allows admin. The requireAdmin middleware to be removed, so that when any user, admin or not, wants to update their profile, it will allow them to do so with the correct renderation. Moved auth logic from route to middleware/auth.js
```
router.patch(
  "/:username",
  authUser,
  requireLogin,
  // FIXES BUG #2 - REMOVING requireAdmin
  async function (req, res, next) {
    try {
      if (!req.curr_admin && req.curr_username !== req.params.username) {
        throw new ExpressError("Only that user or admin can edit a user.", 401);
      }

      // get fields to change; remove token so we don't try to change it
      let fields = { ...req.body };
      delete fields._token;

//

  // BUG 2 TEST
  test("should patch data if self", async function () {
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: tokens.u1, first_name: "new-fn1" }); // u1 is non-admin, updating self
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual({
      username: "u1",
      first_name: "new-fn1",
      last_name: "ln1",
      email: "email1",
      phone: "phone1",
      admin: false,
      password: expect.any(String),
    });
  });

```

## Bug Fix #3
*routes/user.js PATCH:username*
- Route to throw error if invalid data is passed. Here we implemented validation route, installed jsonschema, and added tests to fix the data passing if admin was unable to update profile. New file /schemas/userUpdate.json
```
router.patch(
  "/:username",
  authUser,
  requireLogin,
  // FIXES BUG #2 - REMOVING requireAdmin
  async function (req, res, next) {
    try {
      if (!req.curr_admin && req.curr_username !== req.params.username) {
        throw new ExpressError("Only that user or admin can edit a user.", 401);
      }

      // get fields to change; remove token so we don't try to change it
      let fields = { ...req.body };
      delete fields._token;

      //FIXES BUG #3 - ADDING JSON Schema validation 

      const validator = jsonschema.validate(fields, userUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new ExpressError(errs, 400);
      }

      let user = await User.update(req.params.username, fields);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

//

  // BUG 3 TEST - ABLE TO UPDATE SELF WITHOUT BEING ADMIN
  test("should disallow patching on disallowed fields", async function () {
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: tokens.u1, admin: true });
    expect(response.statusCode).toBe(400);
  });

  // BUG 3 TEST 
  test("should disallow patching on backend side", async function () {
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: tokens.u1, random: false });
    expect(response.statusCode).toBe(400);
  });

  //


```

## Bug Fix $4
*routes/user.js DELETE/:username*
- `await` keyboard missing to un-handled error if a non-existing user is wanting deletion
```
router.delete(
  "/:username",
  authUser,
  requireAdmin,
  async function (req, res, next) {
    try {
      //BUG FIX #4 - User.delete 
      await User.delete(req.params.username);
      return res.json({ message: "deleted" });
    } catch (err) {
      return next(err);
    }
  }
);

//

  //BUG 4 TEST
  test("should throw 404 if user does not exist", async function () {
    const response = await request(app)
      .delete("/users/no-such-user")
      .send({ _token: tokens.u3 }); // u3 is admin
    expect(response.statusCode).toBe(404);
  });
});
```

## Bug Fix #5
*models/users.js*
- We don't want to return all information, such as phone and email address provided at registration. If getAll()
```
  static async getAll(username, password) {
    // FIXES BUG #5 REMOVE EMAIL AND PHONE NUMBER
    const result = await db.query(
      //BUGFIX: removed email and phone
      `SELECT username,
                first_name,
                last_name
            FROM users 
            ORDER BY username`
    );
    return result.rows;
  }
// 

  //BUG 5 TEST
  test("should only list fname and lname of all users", async function () {
    const response = await request(app)
      .get("/users")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(200);
    expect(response.body.users[0]).toEqual({
      username: "u1",
      first_name: "fn1",
      last_name: "ln1",
    });
  });
});
```
## Bug Fix #6
*models.users.js*
- Invalid user entered does not raise an error, even with "throw" keyword. We fixed it so that get(username) will throw this error
```
  static async get(username) {
    const result = await db.query(
      `SELECT username,
                first_name,
                last_name,
                email,
                phone
         FROM users
         WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (!user) {
      //FIXES BUG 6: new ExpressError("No such user", 404);

      throw new ExpressError("No such user", 404);
    }

    return user;
  }

//

  //BUG 6 TEST
  test("should throw 404 if user not found", async function () {
    const response = await request(app)
      .get("/users/not-a-user")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(404);
  });
});
```

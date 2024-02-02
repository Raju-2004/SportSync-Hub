const express = require("express");
const app = express();
const path = require("path");
const { User, sport, sportSession, UserSessions } = require("./models");
const { formatDate, calculateStatus } = require("./views/functions");
var csrf = require("csurf");
var cookieParser = require("cookie-parser");
const passport = require("passport");
const bcrypt = require("bcrypt");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const localStrategy = require("passport-local");
require("dotenv").config();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(
  session({
    secret: "my-super-secret-key-1234567",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(csrf({ cookie: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// const port = process.env.PORT || 4000;
const saltRounds = 10;

// Passport Configuration
passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ where: { email: username } });
        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const result = await bcrypt.compare(password, user.password);
        if (result) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid Password" });
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("serializing user in session", user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app.get("/", (req, res) => {
  res.render("index", { title: "SportSync", user: req.user });
});

app.get("/signup", (req, res) => {
  res.render("signup", {
    title: "Signup",
    csrfToken: req.csrfToken(),
    user: req.user,
  });
});

app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const HashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = await User.create({
      name,
      email,
      password: HashedPassword,
    });
    // res.json(newUser);
    req.login(newUser, (err) => {
      if (err) {
        console.log(err);
      }
      res.redirect("/sports");
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/login", async (req, res) => {
  res.render("login", {
    title: "Login",
    csrfToken: req.csrfToken(),
    user: req.user,
  });
});

app.post(
  "/loginSession",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    // console.log(req.user)
    res.redirect("/sports");
  }
);

app.get("/signout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/sports", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  try {
    const sports = await sport.findAll();
    const sessions = await sportSession.findAll();
    // console.log(sports);
    res.render("sport", {
      title: "sports",
      sports: sports,
      sessions : sessions,
      csrfToken: req.csrfToken(),
      user: req.user,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/sports", async (req, res) => {
  try {
    const name = req.body.sportName;
    console.log(name);
    const newSport = await sport.create({ sportName: name });
    res.redirect("/sports");
  } catch (err) {
    console.log(err);
  }
});

app.get("/create-session/:id",connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.render("createSession", {
    sportId: req.params.id,
    csrfToken: req.csrfToken(),
    user: req.user,
  });
});

app.post("/create-session/:id",connectEnsureLogin.ensureLoggedIn(),async (req, res) => {
  try {
    const {name ,  players, playersHave, playersNeeded, date, startTime, venue} =
      req.body;
    if (
      !name ||
      !playersHave ||
      !playersNeeded ||
      !date ||
      !startTime ||
      !venue ||
      !players
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const playersArray = players.split(",");
    const id = req.params.id;
    const newSportSession = await sportSession.create({
      name,
      players: playersArray,
      playersHave,
      playersNeeded,
      date,
      startTime,
      venue,
      sportId: id,
      userId : req.user.id
    });
    // res.json(newSportSession);
    res.redirect("/sports");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/sessions", connectEnsureLogin.ensureLoggedIn(),async (req, res) => {
  try {
    const sessions = await sportSession.findAll();
    console.log(sessions);
    res.render("sessions", {
      title: "Sessions",
      sessions: sessions,
      formatDate: formatDate,
      calculateStatus: calculateStatus,
      sport: "0",
      user: req.user,
      csrfToken: req.csrfToken(),
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/sessions/:id", connectEnsureLogin.ensureLoggedIn(),async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const sessions = await sportSession.findAll({
      where: {
        sportId: id,
      },
    });
    const requiredSport = await sport.findAll({
      where : {
        id : id
      }
    })
    console.log(requiredSport);
    res.render("sessions", {
      title: "Sessions",
      sessions: sessions,
      Sport : requiredSport,
      formatDate: formatDate,
      calculateStatus: calculateStatus,
      sport: "1",
      user: req.user,
      csrfToken: req.csrfToken(),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.get('/join-session/:id',(req,res)=>{
//   console.log(req.params.id);
//   res.render('joinSession',{sessionId:req.params.id,csrfToken:req.csrfToken(),user:req.user});
// })

app.post("/join-session/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const sessionId = req.params.id;
    const UserJoinedSession = UserSessions.create({ userId, sessionId });
    const session = await sportSession.findByPk(sessionId);
    const updatePlayers = [...session.players, req.user.name];
    const availablePlayers = session.playersNeeded - 1;
    const playersHave = session.playersHave + 1;
    session.update({
      players: updatePlayers,
      playersHave: playersHave,
      playersNeeded: availablePlayers,
    });
    // res.redirect('/joinedSessions');
    console.log("session joined");
    res.redirect("/sports");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get(
  "/joinedSessions",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    const userId = req.user.id;
    const userSessions = await UserSessions.findAll({
      where: { userId },
      attributes: ["sessionId"],
    });

    // Step 2: Extract sessionIds from the result
    const sessionIds = userSessions.map((userSession) => userSession.sessionId);

    // Step 3: Query Session table to get details of joined sessions
    const joinedSessions = await sportSession.findAll({
      where: { id: sessionIds }, // Use the extracted sessionIds
    });
    console.log(joinedSessions);
    res.render("joinedSessions", {
      title: "JoinedSession",
      sessions: joinedSessions,
      formatDate: formatDate,
      calculateStatus: calculateStatus,
      user: req.user,
    });
  }
);

app.get('/created-sessions',connectEnsureLogin.ensureLoggedIn(),async (req,res)=>{
  const userId = req.user.id;
  const userSessions = await sportSession.findAll({
    where : {
      userId : userId
    }
  })
  console.log(userSessions);
  res.render("sessions", {
    title: "Created-Sessions",
    sessions: userSessions,
    formatDate: formatDate,
    calculateStatus: calculateStatus,
    sport: "1",
    user: req.user,
    csrfToken: req.csrfToken(),
  });
})

app.post("/cancelSession/:id", async (req, res) => {
  try {
    const  sessionId= req.params.id;
    const session = await sportSession.findByPk(sessionId);
    console.log(session)
    if (!session) {
      throw new Error("Session not found.");
    }
    session.cancellation_reason = "session postponed"
    session.cancellation_status = true;
    await session.save();
    console.log(session);
    res.redirect("/created-sessions");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = app;

const request = require("supertest");
const db = require("../models/index");
const app = require("../server");
const cheerio = require("cheerio");
const { sport, sportSession } = require("../models");

let server, agent;

function extractCsrfToken(res) {
  const $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

const login = async (agent, username, password) => {
  let res = await agent.get("/login");
  const match = res.text.match(/name="csrf" value="(.*?)"/);
  if (match) {
    const csrfToken = match[1];
    res = await agent
      .post("/loginSession")
      .send({ email: username, password, _csrf: csrfToken });
  }
};

describe("Signup Test", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(5000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  test("Sign Up", async () => {
    let res = await agent.get("/signup");
    const match = res.text.match(/name="csrf" value="(.*?)"/);
    if (match) {
      const csrfToken = match[1];
      res = await agent.post("/users").send({
        name: "user",
        email: "userA@example.com",
        password: "1234",
        csrf: csrfToken,
      });
      console.log(res);
      expect(res.statusCode).toBe(302);
    } else {
      console.log("CSRF token not found in signup page");
    }
  });
  test("sign out", async () => {
    let res = await agent.get("/sports");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/signout");
    res = await agent.get("/sports");
    expect(res.statusCode).toBe(302);
  });
  test("to create a new sport", async () => {
    await login(agent, "userA@example.com", "1234");
    const res = await agent.get("/sports");
    const match = res.text.match(/name="csrf" value="(.*?)"/);
    if (match) {
      const csrfToken = match[1];
      const response = await agent.post("/sports").send({
        sportName: "footBall",
      });
      expect(response.statusCode).toBe(302);
    } else {
      console.log("CSRF token not found in signup page");
    }
  });
  test("to create a new sportSession", async () => {
    await login(agent, "userA@example.com", "1234");
    const OneSport = sport.findOne({
      where: {
        sportName: "footBall",
      },
    });
    const res = await agent.get(`/create-session/${OneSport.id}`);
    const match = res.text.match(/name="csrf" value="(.*?)"/);
    if (match) {
      const csrfToken = match[1];
      const response = agent.post(`/create-session/${OneSport.id}`).send({
        name: "tournament",
        players: "raju,user",
        playersHave: 2,
        playersNeeded: 9,
        date: "2024-01-29",
        startTime: "10:00",
        venue: "college Ground",
      });
      expect(response.statusCode).toBe(302);
    } else {
      console.log("CSRF token not found in signup page");
    }
  });
  test("to join new session", async () => {
    await login(agent, "userA@example.com", "1234");
    const OneSport = sport.findOne({
      where: {
        sportName: "footBall",
      },
    });
    const res = await agent.get(`/sessions/${OneSport.id}`);
    const match = res.text.match(/name="csrf" value="(.*?)"/);
     const Session = sportSession.findOne({
      where: {
        startTime: "10:00",
      },
    });
    if (match) {
      const csrfToken = match[1];
      const response = agent.post(`/join-session/${Session.id}`)
      expect(response.statusCode).toBe(302);
    } else {
      console.log("CSRF token not found in signup page");
    }
  });
});

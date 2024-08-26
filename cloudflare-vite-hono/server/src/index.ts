import { Hono } from "hono";

type Bindings = {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/token", async (c) => {
  const code = await c.req
    .json()
    .then(({ code }) => {
      return code;
    })
    .catch(() => {
      return undefined;
    });

  if (code === undefined) {
    return c.json({ error: "Code is undefined" });
  }

  if (code === null) {
    return c.json({ error: "Code is null" });
  }

  if (typeof code !== "string") {
    return c.json({ error: "Code is not a string" });
  }

  const { access_token, error } = await fetch(
    `https://discord.com/api/oauth2/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: c.env.CLIENT_ID,
        client_secret: c.env.CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
      }),
    }
  ).then(async (response) => {
    if (!response.ok) {
      console.error({
        status: response.status,
        details: response.statusText,
        code,
      });
      return { access_token: "", error: "Failed to get access token" };
    }

    return response.json() as Promise<{ access_token: string; error: string }>;
  });

  return c.json({ access_token, error });
});

export default app;

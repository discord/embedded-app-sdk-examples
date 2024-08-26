import { useState, useEffect } from "react";
import { discordSdk } from "./discordSdk";

function App() {
  const [count, setCount] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [auth, setAuth] = useState<object | null>(null);

  useEffect(() => {
    async function setupSdk() {
      setMessages((prev) => [...prev, "Setting up SDK"]);

      await discordSdk.ready();

      const { code } = await discordSdk.commands.authorize({
        client_id: import.meta.env.VITE_CLIENT_ID,
        response_type: "code",
        state: "",
        prompt: "none",
        scope: ["identify"],
      });

      setMessages((prev) => [...prev, `Got code: ${code}`]);

      const { access_token } = await fetch("/.proxy/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
        }),
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(res.statusText);
          }

          const data = await res.json();

          setMessages((prev) => [
            ...prev,
            `Got data: ${JSON.stringify(data, null, 2)}`,
          ]);

          return data;
        })
        .catch((err) => {
          setMessages((prev) => [...prev, `Error: ${err.message}`]);
        });

      const auth = await discordSdk.commands.authenticate({
        access_token,
      });

      setAuth(auth);

      setMessages((prev) => [...prev, `Authenticated!`]);
    }

    setupSdk();
  }, []);

  return (
    <main>
      <section>
        <button onClick={() => setCount(count + 1)}>Click me</button>
        <p>{count}</p>
      </section>
      <section>
        <h2>Messages</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Auth</h2>
        <pre>{JSON.stringify(auth, null, 2)}</pre>
      </section>
    </main>
  );
}

export default App;

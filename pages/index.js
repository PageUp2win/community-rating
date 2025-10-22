import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState("");
  const [logged, setLogged] = useState(false);

  async function verify() {
    const res = await fetch("/api/verifyCode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    const data = await res.json();
    if (data.success) setLogged(true);
    else alert("Invalid or inactive code");
  }

  return (
    <main style={{ padding: 40 }}>
      {!logged ? (
        <div>
          <h1>Enter Verification Code</h1>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="XXXX-YYYY-ZZZZ"
          />
          <button onClick={verify}>Verify</button>
        </div>
      ) : (
        <div>Welcome, verified player.</div>
      )}
    </main>
  );
}

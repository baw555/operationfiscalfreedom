import { useState } from "react";
import Container from "@/components/Container";

export default function Intake() {
  const [status, setStatus] = useState("");

  async function submit(e: any) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));

    const res = await fetch("/api/vlt-intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const json = await res.json();
    setStatus(`Routed to: ${json.routedTo}`);
  }

  return (
    <Container>
      <h1 className="text-3xl font-bold mt-12">Secure Intake</h1>

      <form onSubmit={submit} className="mt-6 space-y-4 max-w-xl">
        <input name="name" placeholder="Name" className="border p-2 w-full" />
        <input name="email" placeholder="Email" className="border p-2 w-full" />

        <select name="issue" className="border p-2 w-full">
          <option value="credits">Tax Credits</option>
          <option value="resolution">Tax Resolution</option>
          <option value="other">Other</option>
        </select>

        <button className="btn">Submit Intake</button>
      </form>

      {status && <p className="mt-4">{status}</p>}
    </Container>
  );
}

"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setReply("");

    try {
      const response = await fetch("api/hello-claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      setReply(data.reply);
    } catch {
      setReply("Error: Could not connect to API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Social Stories AI</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Ask Me Something:
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Generate a story outline about ..."
            className="w-full p3 border rounded-lg"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !message}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
        >
          {loading ? "Thinking..." : "Generate"}
        </button>
      </form>

      {reply && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="font-semibold mb-2">Response:</h2>
          <p className="whitespace-pre-wrap">{reply}</p>
        </div>
      )}
    </main>
  );
}

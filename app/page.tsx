"use client";

import { useState } from "react";

type Entry = {
  id: number;
  machine: string;
  produced: number;
  rejected: number;
};

export default function Home() {
  // The saved entries, and what the user is typing right now
  const [entries, setEntries] = useState<Entry[]>([]);
  const [machine, setMachine] = useState("");
  const [produced, setProduced] = useState("");
  const [rejected, setRejected] = useState("");

  // Runs when the user presses the Add button
  function addEntry() {
    if (!machine || !produced) return;

    const entry: Entry = {
      id: Date.now(),
      machine,
      produced: Number(produced),
      rejected: Number(rejected) || 0,
    };

    setEntries([entry, ...entries]);
    setMachine("");
    setProduced("");
    setRejected("");
  }

  // Totals calculated from the list
  const totalProduced = entries.reduce((sum, e) => sum + e.produced, 0);
  const totalRejected = entries.reduce((sum, e) => sum + e.rejected, 0);
  const quality =
    totalProduced > 0
      ? ((totalProduced - totalRejected) / totalProduced) * 100
      : 0;

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-1 text-3xl font-bold">Proline Ops</h1>
      <p className="mb-6 text-gray-400">Production log</p>

      <div className="mb-6 grid gap-3 rounded-lg border border-gray-500 p-4">
        <input
          value={machine}
          onChange={(e) => setMachine(e.target.value)}
          placeholder="Machine or line (e.g. Mixer 1)"
          className="rounded border border-gray-500 p-3"
        />
        <input
          value={produced}
          onChange={(e) => setProduced(e.target.value)}
          placeholder="Units produced"
          inputMode="numeric"
          className="rounded border border-gray-500 p-3"
        />
        <input
          value={rejected}
          onChange={(e) => setRejected(e.target.value)}
          placeholder="Units rejected"
          inputMode="numeric"
          className="rounded border border-gray-500 p-3"
        />
        <button
          onClick={addEntry}
          className="rounded bg-blue-700 p-3 font-semibold text-white"
        >
          Add entry
        </button>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg border border-gray-500 p-3">
          <div className="text-2xl font-bold">{totalProduced}</div>
          <div className="text-sm text-gray-400">Produced</div>
        </div>
        <div className="rounded-lg border border-gray-500 p-3">
          <div className="text-2xl font-bold">{totalRejected}</div>
          <div className="text-sm text-gray-400">Rejected</div>
        </div>
        <div className="rounded-lg border border-gray-500 p-3">
          <div className="text-2xl font-bold">{quality.toFixed(1)}%</div>
          <div className="text-sm text-gray-400">Quality</div>
        </div>
      </div>

      <ul className="space-y-2">
        {entries.map((e) => (
          <li
            key={e.id}
            className="flex justify-between rounded border border-gray-500 p-3"
          >
            <span>{e.machine}</span>
            <span>
              {e.produced} made, {e.rejected} rejected
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
"use client";

import { useState } from "react";

type Shift = "Day" | "Night";

type Entry = {
  id: number;
  shift: Shift;
  machine: string;
  produced: number;
  rejected: number;
};

type Stop = {
  id: number;
  shift: Shift;
  machine: string;
  reason: string;
  minutes: number;
};

const REASONS = [
  "Breakdown",
  "Changeover",
  "No material",
  "Waiting for operator",
  "Quality check",
  "Cleaning",
  "Power outage",
];

export default function Home() {
  // Which tab is showing, and the fields both forms share
  const [tab, setTab] = useState<"production" | "downtime">("production");
  const [shift, setShift] = useState<Shift>("Day");
  const [machine, setMachine] = useState("");

  // Production data
  const [entries, setEntries] = useState<Entry[]>([]);
  const [produced, setProduced] = useState("");
  const [rejected, setRejected] = useState("");

  // Downtime data
  const [stops, setStops] = useState<Stop[]>([]);
  const [reason, setReason] = useState(REASONS[0]);
  const [minutes, setMinutes] = useState("");

  function addEntry() {
    if (!machine || !produced) return;
    const entry: Entry = {
      id: Date.now(),
      shift,
      machine,
      produced: Number(produced),
      rejected: Number(rejected) || 0,
    };
    setEntries([entry, ...entries]);
    setProduced("");
    setRejected("");
  }

  function addStop() {
    if (!machine || !minutes) return;
    const stop: Stop = {
      id: Date.now(),
      shift,
      machine,
      reason,
      minutes: Number(minutes),
    };
    setStops([stop, ...stops]);
    setMinutes("");
  }

  // Totals
  const totalProduced = entries.reduce((sum, e) => sum + e.produced, 0);
  const totalRejected = entries.reduce((sum, e) => sum + e.rejected, 0);
  const quality =
    totalProduced > 0
      ? ((totalProduced - totalRejected) / totalProduced) * 100
      : 0;
  const totalMinutes = stops.reduce((sum, s) => sum + s.minutes, 0);

  // Pareto: minutes lost per reason, biggest first
  const byReason = REASONS.map((r) => ({
    reason: r,
    minutes: stops
      .filter((s) => s.reason === r)
      .reduce((sum, s) => sum + s.minutes, 0),
  }))
    .filter((r) => r.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes);
  const maxMinutes = byReason.length > 0 ? byReason[0].minutes : 1;

  const tabClass = (active: boolean) =>
    "flex-1 rounded p-3 font-semibold " +
    (active ? "bg-blue-700 text-white" : "border border-gray-500");

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-1 text-3xl font-bold">Proline Ops</h1>
      <p className="mb-6 text-gray-400">Production and downtime log</p>

      <div className="mb-4 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
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
        <div className="rounded-lg border border-gray-500 p-3">
          <div className="text-2xl font-bold">{totalMinutes}</div>
          <div className="text-sm text-gray-400">Minutes lost</div>
        </div>
      </div>

      <div className="mb-4 flex gap-3">
        <button
          onClick={() => setTab("production")}
          className={tabClass(tab === "production")}
        >
          Production
        </button>
        <button
          onClick={() => setTab("downtime")}
          className={tabClass(tab === "downtime")}
        >
          Downtime
        </button>
      </div>

      <div className="mb-6 grid gap-3 rounded-lg border border-gray-500 p-4">
        <select
          value={shift}
          onChange={(e) => setShift(e.target.value as Shift)}
          className="rounded border border-gray-500 bg-white p-3 text-black"
        >
          <option value="Day">Day shift</option>
          <option value="Night">Night shift</option>
        </select>
        <input
          value={machine}
          onChange={(e) => setMachine(e.target.value)}
          placeholder="Machine or line (e.g. Mixer 1)"
          className="rounded border border-gray-500 p-3"
        />

        {tab === "production" ? (
          <>
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
              Add production entry
            </button>
          </>
        ) : (
          <>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="rounded border border-gray-500 bg-white p-3 text-black"
            >
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <input
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              placeholder="Minutes lost"
              inputMode="numeric"
              className="rounded border border-gray-500 p-3"
            />
            <button
              onClick={addStop}
              className="rounded bg-orange-500 p-3 font-semibold text-white"
            >
              Add downtime entry
            </button>
          </>
        )}
      </div>

      {tab === "production" ? (
        <ul className="space-y-2">
          {entries.map((e) => (
            <li
              key={e.id}
              className="flex justify-between rounded border border-gray-500 p-3"
            >
              <span>
                {e.machine} <span className="text-gray-400">({e.shift})</span>
              </span>
              <span>
                {e.produced} made, {e.rejected} rejected
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <h2 className="mb-3 text-xl font-semibold">
            Where the time goes (Pareto)
          </h2>
          {byReason.length === 0 && (
            <p className="mb-4 text-gray-400">No downtime logged yet.</p>
          )}
          <div className="mb-6 space-y-2">
            {byReason.map((r) => (
              <div key={r.reason}>
                <div className="flex justify-between text-sm">
                  <span>{r.reason}</span>
                  <span>{r.minutes} min</span>
                </div>
                <div className="h-3 rounded bg-gray-700">
                  <div
                    className="h-3 rounded bg-orange-500"
                    style={{ width: (r.minutes / maxMinutes) * 100 + "%" }}
                  />
                </div>
              </div>
            ))}
          </div>

          <ul className="space-y-2">
            {stops.map((s) => (
              <li
                key={s.id}
                className="flex justify-between rounded border border-gray-500 p-3"
              >
                <span>
                  {s.machine}{" "}
                  <span className="text-gray-400">({s.shift})</span>
                </span>
                <span>
                  {s.reason}: {s.minutes} min
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
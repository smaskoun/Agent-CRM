import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";
import readline from "node:readline";

interface HostStats {
  readonly host: string;
  connections: number;
  authentications: number;
  authorizations: number;
  disconnections: number;
  totalSessionSeconds: number;
  shortSessions: number;
  sessionUsers: Map<string, number>;
  authorizationUsers: Map<string, number>;
  authMethods: Map<string, number>;
}

interface AnalyzerSummary {
  totalLines: number;
  hosts: HostStats[];
  checkpointStarts: number;
  checkpointCompletes: number;
}

const SHORT_SESSION_THRESHOLD_SECONDS = 5;

function getHostStats(stats: Map<string, HostStats>, host: string): HostStats {
  const existing = stats.get(host);
  if (existing) {
    return existing;
  }

  const created: HostStats = {
    host,
    connections: 0,
    authentications: 0,
    authorizations: 0,
    disconnections: 0,
    totalSessionSeconds: 0,
    shortSessions: 0,
    sessionUsers: new Map<string, number>(),
    authorizationUsers: new Map<string, number>(),
    authMethods: new Map<string, number>(),
  };
  stats.set(host, created);
  return created;
}

function parseDurationToSeconds(value: string): number {
  const segments = value.split(":");
  if (segments.length !== 3) {
    return Number.NaN;
  }

  const [hours, minutes, secondsPart] = segments;
  const totalSeconds = Number(hours) * 3600 + Number(minutes) * 60 + Number(secondsPart);
  return Number.isFinite(totalSeconds) ? totalSeconds : Number.NaN;
}

function extractHost(line: string): string {
  const hostMatch = /host=([\w.:-]+)/.exec(line);
  if (hostMatch?.[1]) {
    return hostMatch[1];
  }

  const clientMatch = /client=([\w.:-]+)/.exec(line);
  if (clientMatch?.[1]) {
    return clientMatch[1];
  }

  return "unknown";
}

function incrementMapValue(map: Map<string, number>, key: string, amount = 1) {
  const current = map.get(key) ?? 0;
  map.set(key, current + amount);
}

async function readInputLines(): Promise<string[]> {
  const [filePath] = process.argv.slice(2);

  if (!filePath && process.stdin.isTTY) {
    throw new Error("Provide a log file path or pipe log contents via stdin.");
  }

  const inputStream = filePath
    ? createReadStream(resolve(process.cwd(), filePath), { encoding: "utf8" })
    : process.stdin;

  const reader = readline.createInterface({ input: inputStream, crlfDelay: Infinity });
  const lines: string[] = [];

  for await (const line of reader) {
    lines.push(line);
  }

  return lines;
}

function analyzeLines(lines: readonly string[]): AnalyzerSummary {
  const hostStats = new Map<string, HostStats>();
  let totalLines = 0;
  let checkpointStarts = 0;
  let checkpointCompletes = 0;

  const connectionReceivedRegex = /connection received: host=([\w.:-]+) port=(\d+)/;
  const authenticationRegex = /connection authenticated: identity="([^"]*)" method=([^ ]+)/;
  const authorizationRegex = /connection authorized: user=([^ ]+) database=([^ ]+)/;
  const disconnectionRegex =
    /disconnection: session time: ([0-9:.]+) user=([^ ]*) database=([^ ]*) host=([\w.:-]+) port=(\d+)/;

  for (const line of lines) {
    totalLines += 1;

    if (connectionReceivedRegex.test(line)) {
      const host = extractHost(line);
      const stats = getHostStats(hostStats, host);
      stats.connections += 1;
      continue;
    }

    const authenticationMatch = authenticationRegex.exec(line);
    if (authenticationMatch) {
      const host = extractHost(line);
      const stats = getHostStats(hostStats, host);
      stats.authentications += 1;
      const method = authenticationMatch[2];
      incrementMapValue(stats.authMethods, method);
      continue;
    }

    const authorizationMatch = authorizationRegex.exec(line);
    if (authorizationMatch) {
      const host = extractHost(line);
      const stats = getHostStats(hostStats, host);
      stats.authorizations += 1;
      const user = authorizationMatch[1] || "unknown";
      incrementMapValue(stats.authorizationUsers, user);
      continue;
    }

    const disconnectionMatch = disconnectionRegex.exec(line);
    if (disconnectionMatch) {
      const [, durationRaw, userRaw, , host] = disconnectionMatch;
      const stats = getHostStats(hostStats, host);
      stats.disconnections += 1;
      const user = userRaw || "unknown";
      incrementMapValue(stats.sessionUsers, user);

      const durationSeconds = parseDurationToSeconds(durationRaw);
      if (Number.isFinite(durationSeconds)) {
        stats.totalSessionSeconds += durationSeconds;
        if (durationSeconds <= SHORT_SESSION_THRESHOLD_SECONDS) {
          stats.shortSessions += 1;
        }
      }

      continue;
    }

    if (line.includes("checkpoint starting")) {
      checkpointStarts += 1;
      continue;
    }

    if (line.includes("checkpoint complete")) {
      checkpointCompletes += 1;
    }
  }

  const hosts = Array.from(hostStats.values()).sort((a, b) => b.connections - a.connections);

  return { totalLines, hosts, checkpointStarts, checkpointCompletes };
}

function formatPercentage(part: number, total: number): string {
  if (total === 0) {
    return "0%";
  }
  return `${((part / total) * 100).toFixed(1)}%`;
}

function printSummary(summary: AnalyzerSummary): void {
  if (summary.totalLines === 0) {
    // eslint-disable-next-line no-console
    console.log("No log lines were processed.");
    return;
  }

  // eslint-disable-next-line no-console
  console.log(`Processed ${summary.totalLines} lines.`);

  if (summary.checkpointStarts > 0 || summary.checkpointCompletes > 0) {
    // eslint-disable-next-line no-console
    console.log(
      `Checkpoint events: ${summary.checkpointStarts} start(s), ${summary.checkpointCompletes} complete(s).`,
    );
  }

  if (summary.hosts.length === 0) {
    // eslint-disable-next-line no-console
    console.log("No connection activity detected.");
    return;
  }

  for (const host of summary.hosts) {
    const averageSessionSeconds =
      host.disconnections > 0 ? host.totalSessionSeconds / host.disconnections : 0;

    // eslint-disable-next-line no-console
    console.log(`\nHost ${host.host}`);
    // eslint-disable-next-line no-console
    console.log(`  Connections received: ${host.connections}`);
    // eslint-disable-next-line no-console
    console.log(`  Authenticated: ${host.authentications}`);
    // eslint-disable-next-line no-console
    console.log(`  Authorized: ${host.authorizations}`);
    // eslint-disable-next-line no-console
    console.log(`  Disconnections: ${host.disconnections}`);

    // eslint-disable-next-line no-console
    console.log(
      `  Short sessions (<= ${SHORT_SESSION_THRESHOLD_SECONDS}s): ${host.shortSessions}` +
        ` (${formatPercentage(host.shortSessions, host.disconnections)} of disconnections)`,
    );
    // eslint-disable-next-line no-console
    console.log(`  Average session length: ${averageSessionSeconds.toFixed(3)}s`);

    if (host.authorizationUsers.size > 0) {
      const authorizedSummary = Array.from(host.authorizationUsers.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([user, count]) => `${user || "unknown"} (${count})`)
        .join(", ");
      // eslint-disable-next-line no-console
      console.log(`  Authorized users: ${authorizedSummary}`);
    }

    if (host.sessionUsers.size > 0) {
      const usersSummary = Array.from(host.sessionUsers.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([user, count]) => `${user || "unknown"} (${count})`)
        .join(", ");
      // eslint-disable-next-line no-console
      console.log(`  Users ending sessions: ${usersSummary}`);
    }

    if (host.authMethods.size > 0) {
      const methodsSummary = Array.from(host.authMethods.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([method, count]) => `${method} (${count})`)
        .join(", ");
      // eslint-disable-next-line no-console
      console.log(`  Auth methods: ${methodsSummary}`);
    }

    if (host.disconnections > 0 && host.shortSessions / host.disconnections > 0.8) {
      // eslint-disable-next-line no-console
      console.log(
        "  Insight: The majority of sessions are very short. Consider using connection pooling or",
      );
      // eslint-disable-next-line no-console
      console.log(
        "           reviewing application code to ensure connections are reused effectively.",
      );
    }

    if (host.authorizations < host.connections) {
      // eslint-disable-next-line no-console
      console.log(
        `  Insight: ${host.connections - host.authorizations} connection(s) did not reach authorization.`,
      );
    }
  }
}

async function main() {
  try {
    const lines = await readInputLines();
    const summary = analyzeLines(lines);
    printSummary(summary);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error((error as Error).message);
    process.exitCode = 1;
  }
}

void main();

import "./load-env.mjs";
import { spawnSync } from "node:child_process";

const commands = {
  up: ["up", "-d", "--wait", "db"],
  down: ["stop", "db"],
  status: ["ps"],
  logs: ["logs", "--tail", "100", "db"],
};
const args = commands[process.argv[2]];
if (!args) throw new Error("Usage: node scripts/db.mjs up|down|status|logs");

const result = spawnSync("docker", ["compose", ...args], { stdio: "inherit" });
if (result.error) console.error(result.error.message);
process.exitCode = result.status ?? 1;

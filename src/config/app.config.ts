export function getAppDetails(port: number, host: string, environment: string, threads: number): Array<Record<string, any>> {
  const memory = Math.floor(process.memoryUsage().rss / (1024 * 1024)) + "MB";
  const uptime = Math.floor(process.uptime() / 60) + " min";
  return [{ memory, pid: process.pid, port, host, environment, app: "PORTFOLIO BACKEND", uptime, threads }]
}
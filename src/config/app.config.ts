export function getAppDetails(port: number, host: string, environment: string): Array<Record<string, any>> {
  const memory = Math.floor(process.memoryUsage().rss / (1024 * 1024)) + "MB";
  return [{ memory, pid: process.pid, port, host, environment }];
}
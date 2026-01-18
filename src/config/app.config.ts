export function getAppDetails(environment: string): string {
  const memory = Math.floor(process.memoryUsage().rss / (1024 * 1024));
  const startupString = `Portfolio builder backend (${process.pid}) is running in ${environment} mode and is consuming ${memory} MB of memory 🚀🚀🚀🚀`;
  return startupString;
}

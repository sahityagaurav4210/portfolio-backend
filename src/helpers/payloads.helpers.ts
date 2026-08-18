export function getSafeEditProfilePayload(payload: Record<string, any>): Record<string, any> {
  const entries = Object.entries(payload);
  const processedPayload: Record<string, any> = {};

  for (const e of entries) {
    if (e[1] === '') processedPayload[e[0]] = null;
    if (e[1]) processedPayload[e[0]] = e[1];
  }

  return processedPayload;
}

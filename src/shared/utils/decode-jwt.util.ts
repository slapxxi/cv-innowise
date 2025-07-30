export function decodeJWT(token: string) {
  const [header, payload, signature] = token.split('.');
  return {
    header: decodeBase64Url(header),
    payload: decodeBase64Url(payload),
    signature,
  };
}

function decodeBase64Url(str: string) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const json = atob(padded);
  return JSON.parse(json);
}

/** Render the branch's copied mark without changing the signed manifest bytes. */
export function registryIconUrl(icon: string): string {
  const origin = 'https://registry.partylayer.xyz/';
  return icon.startsWith(`${origin}wallets/`) ? `/registry/${icon.slice(origin.length)}` : icon;
}

import registry from '../../../../registry/v1/beta/registry.json';
import { registryIconUrl } from './registry-icon';

/** Derived from the same manifest the demo serves; no hand-maintained logo list. */
export const DEMO_WALLET_ICONS = Object.fromEntries(
  registry.wallets.map(wallet => [wallet.id, registryIconUrl(wallet.icon)]),
);

---
"@partylayer/adapter-loop": patch
---

Require `@fivenorth/loop-sdk` ^0.15.1, so signing opens the wallet on the domain
the user connected through.

Loop moved its wallet from `*.cantonloop.com` to `wallet.*.looptech.io`
(`@fivenorth/loop-sdk` 0.15.0, fivenorth-io/loop-sdk#88), keeping the old domain
as `secondaryWalletUrl`. The API host and the pairing socket stay on
`*.cantonloop.com`. From 0.15.0 the SDK records which domain approved the
connection (`isFromOldDomain` in the handshake) and opens the signing window
there (`resolveWalletUrl`). 0.13.x has no notion of two domains: it always opens
`walletUrl`, which it still sets to the old domain.

`^0.13.0` cannot resolve to 0.15. On a devnet transfer through 0.13.4, a user
whose wallet runs on `wallet.devnet.looptech.io` approved "Payvol wants to send
… CBTC" and got "Action failed: Prepared transaction not found". The adapter
passes no `walletUrl`, so taking the SDK's defaults is the whole change.

The SDK's public API change from 0.13.4 to 0.15.1 is additive for what this
adapter uses:
- `init` gains an optional `secondaryWalletUrl`;
- the session gains `walletUrl`;
- `ExecuteSubmissionResquest` is kept as an alias of `ExecuteSubmissionRequest`;
- the dist `provider.js` is byte-identical.

Typecheck and the adapter's 65 tests pass unchanged.

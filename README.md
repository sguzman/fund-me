# fund-me

A static funding directory for [sguzman](https://github.com/sguzman), covering software, mathematics and independent computing.

**Website:** https://sguzman.github.io/fund-me/

## Maintenance

Edit `data/channels.js`. All entries start with a null address or URL and are displayed as Coming soon. No fake links, sample wallet addresses, accounts, or secrets are included.

- For a wallet, paste its verified **public receiving address** into the matching asset/network entry. Do not use a private key, recovery phrase, password, or extended private key.
- If a memo or destination tag is required, include the exact verified instruction in the note.
- Optionally save a locally generated, independently checked QR PNG under `assets/qr/` and set the entry's qr field to its relative path, e.g. `assets/qr/btc.png`. Verify that the QR decodes to the exact displayed address; do not use external QR services.
- For a payment platform, set url to the verified HTTPS public donation page, not an account management URL.
- Verify each address and network against the original wallet and each payment link against the intended account before publishing. Test a small payment when practical.
- To deactivate an entry, set its address or URL back to null (also clear qr for a wallet).

All assets are served locally; no external JavaScript, fonts, analytics, payment form, build step, or backend. Open index.html locally or serve the root with any static web server. GitHub Pages should serve main / (root).

The original SVG artwork is a geometric mountain sunrise inspired by the profile's visual direction, not the original Twitter banner.

# Security Policy

## Supported versions

This library is published as `nettoolskit`. Security fixes are applied to the
latest published `0.x` preview line. Older preview tags are not maintained.

| Version | Supported |
|---|---|
| latest `0.x` | yes |
| older tags | no |

## Reporting a vulnerability

Please report suspected vulnerabilities **privately** — do not open a public
issue for undisclosed problems.

- Preferred: GitHub Security Advisories ("Report a vulnerability") on
  `NetToolsKit/nettoolskit-ui`.
- Alternatively: email the maintainer at `tguislotti@gmail.com` with steps to
  reproduce and affected versions.

You can expect an initial acknowledgement within a few business days. Please
allow reasonable time for a fix before any public disclosure.

## Supply-chain hardening

- Production dependencies are gated in CI and locally via
  `npm run sec:audit` (`npm audit --omit=dev --audit-level=high`), which also
  runs as part of `npm run verify`.
- Releases should be published from CI with Sigstore provenance:
  `npm publish --provenance --access public`. Provenance lets consumers verify
  the package was built from this repository.
- The package ships only built artifacts and declared assets (see the `files`
  field in `package.json`).
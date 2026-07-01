# Architecture Decision Records (ADRs)

Load-bearing decisions for the NetToolsKit UI frontend platform. An ADR is
immutable once accepted; to change a decision, add a new ADR that supersedes the
old one (and update its Status).

Add a record by copying `0000-adr-template.md` to the next number.

| ADR | Title | Status |
|---|---|---|
| 0001 | Quasar as adapter; Ds* is the public contract | superseded by 0006 |
| 0002 | Schema-driven front creation system | accepted |
| 0003 | Eliminate the legacy Ntk*/Base* surface | accepted |
| 0004 | DTCG token pipeline as the source of visual truth | accepted |
| 0005 | Governed quality gates (verify, coverage, import boundaries) | accepted |
| 0006 | Native-element primitives; Quasar as optional service adapters | accepted |
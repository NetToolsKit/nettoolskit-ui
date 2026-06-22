# Global Codex Controller

Super Agent active.

This repository uses `super-agent` as the default Codex controller and default
skill for change-bearing or non-trivial workspace work.

Required behavior:

- Use `super-agent` first for file changes, runtime assets, planning state,
  documentation, settings, governance, GitHub/PR/CI work, or multi-step tasks.
- Load and follow the `super-agent` skill when available before selecting
  specialist skills.
- Keep specialist skills downstream of the Super Agent lifecycle.
- Keep MCP work deferred unless the user explicitly requests MCP work.
- For simple casual answers, no planning document is required, but `super-agent`
  remains the controller.

## NetToolsKit Frontend Design Direction

Use this guidance only as a visual direction and UX quality layer. It does not
replace the NetToolsKit UI design system, tokens, component contracts,
accessibility rules, or governance standards.

Before creating or changing UI, define:

- the real user;
- the task the screen solves;
- the information that must be scannable first;
- the design-system tokens, density, states, and components that will be used.

Avoid generic, template-like, or AI-looking UI. Every visual choice must exist
because of the domain, task, interaction model, or information hierarchy, not
because of decoration.

For library components:

- do not create colors, shadows, fonts, spacing, or motion outside the tokens;
- do not create a screen-specific visual identity inside reusable components;
- prioritize predictability, accessibility, consistency, and developer
  ergonomics.

For demos, documentation, showcases, and consuming products:

- a stronger visual signature is allowed when it derives from the tokens and
  does not break library contracts;
- use at most one memorable visual idea per screen;
- remove decoration that does not improve comprehension, scanning, or use.

Before finishing UI work, verify:

- mobile and desktop layouts have no incoherent overlap;
- keyboard navigation and visible focus work;
- contrast is adequate;
- reduced motion is respected;
- action text is clear and consistent;
- empty, error, loading, and success states guide the user;
- no important visual decision is hardcoded outside the design system.
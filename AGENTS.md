# Project rules

- Use plain JavaScript; do not add frameworks, build tools, or npm dependencies.
- Keep pure quiz logic in `src/quiz.js`, independent of the browser DOM.
- Put DOM access and UI behavior in `src/app.js`.
- Keep colors in CSS variables in `src/style.css`; use variables for all colors.
- Keep the UI accessible, with visible keyboard focus and `aria-live` for changing messages.
- Add or update tests for logic in `tests/`; run them with `npm test`.

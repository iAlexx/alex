/** Latin letters or common tech tokens — isolate in RTL paragraphs. */
const LTR_VALUE_PATTERN = /[A-Za-z]/;

/** Returns `ltr` for technology and product names that should stay Latin in Arabic UI. */
export function factValueDir(value: string): "ltr" | undefined {
  return LTR_VALUE_PATTERN.test(value) ? "ltr" : undefined;
}

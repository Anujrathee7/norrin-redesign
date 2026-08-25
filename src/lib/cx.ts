/**
 * Minimal class-name joiner.
 *
 * Lives in its own module rather than alongside the layout components: mixing
 * non-component exports into a component file breaks React Fast Refresh for
 * that whole file.
 */
export const cx = (...parts: Array<string | false | undefined | null>) =>
  parts.filter(Boolean).join(' ')

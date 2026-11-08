/**
 * Removes leading whitespace while the user is typing, matching the behaviour
 * of the original form controls.
 */
export const formatString = (value: string): string => value.trimStart();

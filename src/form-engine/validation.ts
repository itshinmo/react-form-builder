import type { ControllerFieldState } from "react-hook-form";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const NUMBER_PATTERN = /^-?\d+(?:\.\d+)?$/;

type ErrorMessageOptions = {
  maxLength?: number;
  minLength?: number;
  max?: number;
  min?: number;
  maxRequired?: number;
  minRequired?: number;
};

/**
 * Maps react-hook-form validation error types to human-readable messages.
 */
export const getErrorMessage = (
  fieldState: ControllerFieldState,
  options: ErrorMessageOptions = {},
): string | null => {
  const { error } = fieldState;

  if (!error) return null;

  switch (error.type) {
    case "required":
      return "This field is required.";

    case "maxLength":
      return `Please use at most ${options.maxLength ?? 0} characters.`;

    case "minLength":
      return `Please use at least ${options.minLength ?? 0} characters.`;

    case "max":
      return `Please enter a value no greater than ${options.max ?? 0}.`;

    case "min":
      return `Please enter a value no less than ${options.min ?? 0}.`;

    case "maxRequired":
      return `Please select at most ${options.maxRequired ?? 0} options.`;

    case "minRequired":
      return `Please select at least ${options.minRequired ?? 0} options.`;

    case "pattern":
      return "Please enter a valid value.";

    default:
      return typeof error.message === "string"
        ? error.message
        : "Please check this field.";
  }
};

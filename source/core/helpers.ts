import { z } from "../deps.ts";

export namespace Validation {
  export type Result<T> = SuccessfulResult<T> | FailedResult;

  export type SuccessfulResult<T> = {
    success: true;
    data: T;
  };

  export type FailedResult = {
    success: false;
    issues: string[];
  };

  export type ValidateFunction<T> = (value: unknown) => Result<T>;

  export function run<T extends z.ZodTypeAny>(
    schema: T,
    value: unknown,
  ): Result<z.infer<T>> {
    const validation = schema.safeParse(value);

    if (validation.success) return validation;

    return { success: false, issues: getIssuesFromZodError(validation.error) };
  }

  export function getIssuesFromZodError(error: z.ZodError) {
    return error.issues.map(getIssueMessage);
  }

  function getIssueMessage(issue: z.ZodIssue) {
    return issue.message;
  }
}

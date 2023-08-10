export namespace TextUtilities {
  /**
   * Replaces placeholders in a given text with values from a context object.
   *
   * @param text - The text containing placeholders.
   * @param context - The object containing key-value pairs for replacement.
   * @returns The text with placeholders replaced by their corresponding values.
   */
  export function replacePlaceholder(text: string, context: Record<string, string>) {
    let newText = text;

    for (const key in context) {
      const toReplace = `{{${key}}}`;

      newText = newText.replaceAll(toReplace, context[key]);
    }

    return newText;
  }

  /**
   * Transforms the first letter of a sentence to uppercase.
   *
   * @param value - The text to transform.
   * @returns The capitalized text.
   */
  export function capitalizeText(value: string) {
    return value
      .replace(/[a-zñáéíóúü]/i, function (letter) {
        return letter.toUpperCase();
      })
      .trim();
  }
}

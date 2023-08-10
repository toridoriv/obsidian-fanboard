export namespace DateUtils {
  export function createTimestamp(date = new Date()) {
    const initialDate = date.toLocaleString("en-ZA");

    return initialDate.replace(", ", "T").replaceAll("/", "-");
  }
}

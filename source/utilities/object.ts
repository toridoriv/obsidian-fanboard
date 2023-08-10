export namespace ObjectUtils {
  /**
   * Makes a property of an object non-enumerable by using `Object.defineProperty`.
   *
   * @param value - The object containing the property to be made non-enumerable.
   * @param key - The key of the property to be made non-enumerable.
   * @returns The object with the specified property made non-enumerable.
   * @template T - The type of the object.
   */
  export function makePropertyNonEnumerable<T extends AnyObject>(
    value: T,
    key: keyof T,
  ) {
    return Object.defineProperty(value, key, {
      enumerable: false,
      value: value[key],
    });
  }
}

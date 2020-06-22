export function onlyTruthy<V>(
  val: undefined | V
): val is Exclude<V, undefined | null> {
  return !!val;
}

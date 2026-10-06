export function requireElement<T extends Element>(
  selector: string,
  type: new () => T,
): T {
  const element = document.querySelector(selector);
  if (!(element instanceof type)) {
    throw new Error(`Missing ${type.name} matching ${selector}`);
  }
  return element;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function mockCall<T>(value: T, ms = 350): Promise<T> {
  await delay(ms);
  // structuredClone to avoid Redux state mutation issues
  return JSON.parse(JSON.stringify(value)) as T;
}

export async function mockFail(message: string, ms = 350): Promise<never> {
  await delay(ms);
  throw new Error(message);
}

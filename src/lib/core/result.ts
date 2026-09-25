export type Ok<V = undefined> = {
  ok: true;
  value: V;
};

export type Err<E> = {
  ok: false;
  error: E;
};

export type Result<V, E> = Ok<V> | Err<E>;

export function Ok(): Ok<undefined>;
export function Ok<V>(value: V): Ok<V>;
export function Ok<V>(value?: V): Ok<V> {
  return { ok: true, value: value as V };
}
export function Err<E>(error: E): Err<E> {
  return { ok: false, error };
}

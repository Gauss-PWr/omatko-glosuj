
export type Result<V, E> = {
    ok: true,
    value: V
} | {
    ok: false,
    error: E
}

export type Outcome<E> =
  | { ok: true }
  | { ok: false; error: E };

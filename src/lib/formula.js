// Mini-spreadsheet engine: supports + - * / ( ), unary minus and cell refs (A1).
// A cell whose text starts with "=" is a formula; plain numbers are values.

export const COLS = ["A", "B", "C", "D", "E"];
export const ROWS = 12;

export const cellKey = (col, row) => `${COLS[col]}${row + 1}`;

class SheetError extends Error {}
const fail = (code) => { throw new SheetError(code); };

const TOKEN = /\s*(?:(\d+\.?\d*|\.\d+)|([A-Za-z]+\d+)|([-+*/()]))/y;

function tokenize(src) {
  const tokens = [];
  TOKEN.lastIndex = 0;
  while (TOKEN.lastIndex < src.length) {
    if (!src.slice(TOKEN.lastIndex).trim()) break;
    const m = TOKEN.exec(src);
    if (!m) fail("#ERR");
    if (m[1] !== undefined) tokens.push({ t: "num", v: parseFloat(m[1]) });
    else if (m[2] !== undefined) tokens.push({ t: "ref", v: m[2].toUpperCase() });
    else tokens.push({ t: "op", v: m[3] });
  }
  return tokens;
}

// Recursive descent: expr → term (+|- term)*, term → unary (*|/ unary)*
function evaluate(src, resolveRef) {
  const tokens = tokenize(src);
  let i = 0;
  const peek = () => tokens[i];
  const isOp = (v) => peek()?.t === "op" && peek().v === v;

  function primary() {
    const tok = tokens[i++];
    if (!tok) fail("#ERR");
    if (tok.t === "num") return tok.v;
    if (tok.t === "ref") return resolveRef(tok.v);
    if (tok.v === "(") {
      const v = expr();
      if (!isOp(")")) fail("#ERR");
      i++;
      return v;
    }
    return fail("#ERR");
  }

  function unary() {
    if (isOp("-")) { i++; return -unary(); }
    if (isOp("+")) { i++; return unary(); }
    return primary();
  }

  function term() {
    let v = unary();
    while (isOp("*") || isOp("/")) {
      const op = tokens[i++].v;
      const r = unary();
      if (op === "/" && r === 0) fail("#DIV/0");
      v = op === "*" ? v * r : v / r;
    }
    return v;
  }

  function expr() {
    let v = term();
    while (isOp("+") || isOp("-")) {
      const op = tokens[i++].v;
      const r = term();
      v = op === "+" ? v + r : v - r;
    }
    return v;
  }

  const result = expr();
  if (i < tokens.length) fail("#ERR");
  return result;
}

// Returns { [key]: number | string } for every non-empty cell; strings are error codes or text.
export function computeSheet(cells) {
  const cache = {};
  const visiting = new Set();

  function valueOf(key) {
    if (key in cache) return cache[key];
    const raw = (cells[key] ?? "").trim();
    if (!raw) return (cache[key] = 0);
    if (visiting.has(key)) fail("#CYC");
    visiting.add(key);
    try {
      let out;
      if (raw.startsWith("=")) {
        out = evaluate(raw.slice(1), (ref) => {
          if (!/^[A-E](?:[1-9]|1[0-2])$/.test(ref)) fail("#REF");
          const v = valueOf(ref);
          if (typeof v !== "number") fail(v);
          return v;
        });
      } else {
        const n = Number(raw.replace(/,/g, ""));
        out = Number.isNaN(n) ? raw : n;
      }
      cache[key] = out;
    } catch (e) {
      if (!(e instanceof SheetError)) throw e;
      cache[key] = e.message;
    } finally {
      visiting.delete(key);
    }
    return cache[key];
  }

  const result = {};
  for (const key of Object.keys(cells)) if (cells[key]?.trim()) result[key] = valueOf(key);
  return result;
}

export const formatValue = (v) =>
  typeof v === "number" ? v.toLocaleString("en-US", { maximumFractionDigits: 6 }) : v;

// Click-to-reference: while editing a formula, insert `key` at the caret if a reference
// makes sense there (right after "=" or an operator / open bracket). Returns null otherwise.
export function insertRef(text, start, end, key) {
  if (!text.startsWith("=") || start < 1) return null;
  const before = text.slice(0, start).trimEnd();
  if (!/[=+\-*/(]$/.test(before)) return null;
  return { text: text.slice(0, start) + key + text.slice(end), caret: start + key.length };
}

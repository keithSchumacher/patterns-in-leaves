# PR: Address Dependabot alerts — Vite (57–59) and yaml (56)

## Summary

This PR targets four open [Dependabot alerts](https://github.com/keithSchumacher/patterns-in-leaves/security/dependabot) on `patterns-in-leaves`: three **Vite** issues (high/moderate, dev-server–focused) and one **yaml** stack-overflow issue (moderate, transitive). Resolution is expected to be **dependency bumps / lockfile refresh** (and optionally **`overrides`** if a parent package pins a vulnerable nested `yaml`).

## Source data (CLI)

Full alert payloads were retrieved with the GitHub CLI:

```bash
gh api repos/keithSchumacher/patterns-in-leaves/dependabot/alerts/56
gh api repos/keithSchumacher/patterns-in-leaves/dependabot/alerts/57
gh api repos/keithSchumacher/patterns-in-leaves/dependabot/alerts/58
gh api repos/keithSchumacher/patterns-in-leaves/dependabot/alerts/59
```

Equivalent REST documentation: [Get a dependabot alert](https://docs.github.com/en/rest/dependabot/alerts#get-a-dependabot-alert).

Snapshot date: **2026-04-07** (fields such as `updated_at` on advisories may change on GitHub’s side).

---

## Alert overview

| # | Package | Severity (GH) | CVE | GHSA | First patched (this repo’s vulnerable line) |
|---|---------|----------------|-----|------|---------------------------------------------|
| [56](https://github.com/keithSchumacher/patterns-in-leaves/security/dependabot/56) | `yaml` | Medium | CVE-2026-33532 | [GHSA-48c2-rrv3-qjmp](https://github.com/advisories/GHSA-48c2-rrv3-qjmp) | `2.8.3` (npm) |
| [57](https://github.com/keithSchumacher/patterns-in-leaves/security/dependabot/57) | `vite` | High | CVE-2026-39364 | [GHSA-v2wj-q39q-566r](https://github.com/advisories/GHSA-v2wj-q39q-566r) | `7.3.2` (npm) |
| [58](https://github.com/keithSchumacher/patterns-in-leaves/security/dependabot/58) | `vite` | Medium | CVE-2026-39365 | [GHSA-4w7w-66w2-5vf9](https://github.com/advisories/GHSA-4w7w-66w2-5vf9) | `7.3.2` (npm) |
| [59](https://github.com/keithSchumacher/patterns-in-leaves/security/dependabot/59) | `vite` | High | CVE-2026-39363 | [GHSA-p9ff-h696-f583](https://github.com/advisories/GHSA-p9ff-h696-f583) | `7.3.2` (npm) |

**Manifest:** all four are reported against **`package-lock.json`**. **Relationship:** **transitive** (not direct `package.json` dependencies).

**API resources:**

- #56 — `https://api.github.com/repos/keithSchumacher/patterns-in-leaves/dependabot/alerts/56`
- #57 — `https://api.github.com/repos/keithSchumacher/patterns-in-leaves/dependabot/alerts/57`
- #58 — `https://api.github.com/repos/keithSchumacher/patterns-in-leaves/dependabot/alerts/58`
- #59 — `https://api.github.com/repos/keithSchumacher/patterns-in-leaves/dependabot/alerts/59`

---

## Alert #56 — `yaml`: Stack overflow via deeply nested YAML

- **State:** open  
- **Created:** 2026-04-05T17:56:01Z  
- **Dependency:** `npm` package **`yaml`**, scope **runtime**, relationship **transitive**, manifest **`package-lock.json`**.  
- **Advisory title:** yaml is vulnerable to Stack Overflow via deeply nested YAML collections  
- **Identifiers:** CVE-2026-33532, GHSA-48c2-rrv3-qjmp  
- **Published:** 2026-03-25T20:08:24Z; **advisory updated:** 2026-03-27T21:34:54Z  
- **Severity (advisory):** medium  
- **CVSS v3.1:** 4.3 — `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:N/I:N/A:L`  
- **CWE:** CWE-674 (Uncontrolled Recursion)  
- **Vulnerable range (affecting this alert):** `>= 2.0.0, < 2.8.3`  
- **First patched version:** `2.8.3`  
- **EPSS (at fetch):** 0.00053 (percentile 0.16923)

### Advisory description (full)

Parsing a YAML document with `yaml` may throw a `RangeError` due to a stack overflow.

The node resolution/composition phase uses recursive function calls without a depth bound. An attacker who can supply YAML for parsing can trigger a `RangeError: Maximum call stack size exceeded` with a small payload (~2–10 KB). The `RangeError` is not a `YAMLParseError`, so applications that only catch YAML-specific errors will encounter an unexpected exception type. Depending on the host application's exception handling, this can fail requests or terminate the Node.js process.

Flow sequences allow deep nesting with minimal bytes (2 bytes per level: one `[` and one `]`). On the default Node.js stack, approximately 1,000–5,000 levels of nesting (2–10 KB input) exhaust the call stack. The exact threshold is environment-dependent (Node.js version, stack size, call stack depth at invocation).

Note: the library's `Parser` (CST phase) uses a stack-based iterative approach and is not affected. Only the compose/resolve phase uses actual call-stack recursion.

All three public parsing APIs are affected: `YAML.parse()`, `YAML.parseDocument()`, and `YAML.parseAllDocuments()`.

The advisory also documents a PoC, version table (fixed in 2.8.3 / 1.10.3), and NVD link: https://nvd.nist.gov/vuln/detail/CVE-2026-33532

### References (from advisory)

- https://github.com/eemeli/yaml/security/advisories/GHSA-48c2-rrv3-qjmp  
- https://github.com/eemeli/yaml/commit/1e84ebbea7ec35011a4c61bbb820a529ee4f359b  
- https://github.com/eemeli/yaml/releases/tag/v1.10.3  
- https://github.com/eemeli/yaml/releases/tag/v2.8.3  

### Repo note (for the fix)

Top-level `package-lock.json` may already list `yaml@2.8.3` while a **nested** copy (e.g. under **`yaml-language-server`** at **`yaml@2.7.1`**) remains in range `< 2.8.3`. Dependabot correctly flags the transitive instance. Fixing may require **`npm overrides`** for `yaml` or upgrading the parent chain once upstream publishes a compatible release.

---

## Alert #57 — Vite: `server.fs.deny` bypassed with queries

- **State:** open  
- **Created:** 2026-04-06T21:52:41Z  
- **Dependency:** `npm` package **`vite`**, scope **runtime**, relationship **transitive**, manifest **`package-lock.json`**.  
- **Advisory title:** Vite: `server.fs.deny` bypassed with queries  
- **Identifiers:** CVE-2026-39364, GHSA-v2wj-q39q-566r  
- **Published:** 2026-04-06T18:03:32Z; **advisory updated:** 2026-04-07T22:16:19Z  
- **Severity (advisory):** high  
- **CVSS v4:** 8.2 — `CVSS:4.0/AV:N/AC:L/AT:P/PR:N/UI:N/VC:H/VI:N/VA:N/SC:N/SI:N/SA:N`  
- **CWE:** CWE-180 (Incorrect Behavior Order: Validate Before Canonicalize), CWE-284 (Improper Access Control)  
- **Vulnerable range (affecting this alert):** `>= 7.1.0, <= 7.3.1`  
- **First patched version:** `7.3.2`  

### Advisory description (full)

**Summary:** The contents of files that are specified by [`server.fs.deny`](https://vite.dev/config/server-options#server-fs-deny) can be returned to the browser.

**Impact:** Only apps that match all of the following are affected:

- explicitly expose the Vite dev server to the network (using `--host` or [`server.host`](https://vitejs.dev/config/server-options.html#server-host))  
- the sensitive file exists in the allowed directories specified by [`server.fs.allow`](https://vite.dev/config/server-options#server-fs-allow)  
- the sensitive file is denied with a pattern that matches a file by [`server.fs.deny`](https://vite.dev/config/server-options#server-fs-deny)  

**Details:** On the Vite dev server, files that should be blocked by `server.fs.deny` (e.g., `.env`, `*.crt`) can be retrieved with HTTP 200 responses when query parameters such as `?raw`, `?import&raw`, or `?import&url&inline` are appended.

### References (from advisory)

- https://github.com/vitejs/vite/security/advisories/GHSA-v2wj-q39q-566r  
- https://github.com/vitejs/vite/pull/22160  
- https://github.com/vitejs/vite/commit/a9a3df299378d9cbc5f069e3536a369f8188c8ff  
- https://github.com/vitejs/vite/releases/tag/v7.3.2  
- https://github.com/vitejs/vite/releases/tag/v8.0.5  
- https://nvd.nist.gov/vuln/detail/CVE-2026-39364  

---

## Alert #58 — Vite: Path traversal in optimized deps `.map` handling

- **State:** open  
- **Created:** 2026-04-06T22:39:32Z  
- **Dependency:** `npm` package **`vite`**, scope **runtime**, relationship **transitive**, manifest **`package-lock.json`**.  
- **Advisory title:** Vite Vulnerable to Path Traversal in Optimized Deps `.map` Handling  
- **Identifiers:** CVE-2026-39365, GHSA-4w7w-66w2-5vf9  
- **Published:** 2026-04-06T18:03:46Z; **advisory updated:** 2026-04-07T22:16:29Z  
- **Severity (advisory):** medium  
- **CVSS v4:** 6.3 — `CVSS:4.0/AV:N/AC:L/AT:P/PR:N/UI:N/VC:L/VI:N/VA:N/SC:N/SI:N/SA:N`  
- **CWE:** CWE-22 (Path Traversal), CWE-200 (Exposure of Sensitive Information to an Unauthorized Actor)  
- **Vulnerable range (affecting this alert):** `>= 7.0.0, <= 7.3.1`  
- **First patched version:** `7.3.2`  

### Advisory description (full)

**Summary:** Any files ending with `.map` even outside the project can be returned to the browser.

**Impact:** Only apps that match both of the following are affected:

- explicitly expose the Vite dev server to the network (using `--host` or [`server.host`](https://vitejs.dev/config/server-options.html#server-host))  
- have sensitive content in files ending with `.map` and the path is predictable  

**Details:** In Vite v7.3.1, the dev server’s handling of `.map` requests for optimized dependencies resolves file paths and calls `readFile` without restricting `../` segments in the URL. As a result, it is possible to bypass the [`server.fs.strict`](https://vite.dev/config/server-options#server-fs-strict) allow list and retrieve `.map` files located outside the project root, provided they can be parsed as valid source map JSON.

The advisory includes a PoC using a file under `/tmp` and optimized-deps URL prefix manipulation.

### References (from advisory)

- https://github.com/vitejs/vite/security/advisories/GHSA-4w7w-66w2-5vf9  
- https://github.com/vitejs/vite/pull/22161  
- https://github.com/vitejs/vite/commit/79f002f2286c03c88c7b74c511c7f9fc6dc46694  
- https://github.com/vitejs/vite/releases/tag/v6.4.2  
- https://github.com/vitejs/vite/releases/tag/v7.3.2  
- https://github.com/vitejs/vite/releases/tag/v8.0.5  
- https://nvd.nist.gov/vuln/detail/CVE-2026-39365  

---

## Alert #59 — Vite: Arbitrary file read via dev server WebSocket

- **State:** open  
- **Created:** 2026-04-06T22:39:43Z  
- **Dependency:** `npm` package **`vite`**, scope **runtime**, relationship **transitive**, manifest **`package-lock.json`**.  
- **Advisory title:** Vite Vulnerable to Arbitrary File Read via Vite Dev Server WebSocket  
- **Identifiers:** CVE-2026-39363, GHSA-p9ff-h696-f583  
- **Published:** 2026-04-06T18:03:24Z; **advisory updated:** 2026-04-07T22:16:11Z  
- **Severity (advisory):** high  
- **CVSS v4:** 8.2 — `CVSS:4.0/AV:N/AC:L/AT:P/PR:N/UI:N/VC:H/VI:N/VA:N/SC:N/SI:N/SA:N`  
- **CWE:** CWE-200 (Exposure of Sensitive Information to an Unauthorized Actor), CWE-306 (Missing Authentication for Critical Function)  
- **Vulnerable range (affecting this alert):** `>= 7.0.0, <= 7.3.1`  
- **First patched version:** `7.3.2`  

### Advisory description (full)

**Summary:** [`server.fs`](https://vite.dev/config/server-options#server-fs-strict) check was not enforced on the `fetchModule` method that is exposed in the Vite dev server's WebSocket.

**Impact:** Only apps that match both of the following are affected:

- explicitly expose the Vite dev server to the network (using `--host` or [`server.host`](https://vitejs.dev/config/server-options.html#server-host))  
- WebSocket is not disabled by `server.ws: false`  

Arbitrary files on the server (development machine, CI environment, container, etc.) can be exposed.

**Details:** If it is possible to connect to the Vite dev server’s WebSocket **without an `Origin` header**, an attacker can invoke `fetchModule` via the custom WebSocket event `vite:invoke` and combine `file://...` with `?raw` (or `?inline`) to retrieve the contents of arbitrary files on the server as a JavaScript string (e.g., `export default "..."`).

The access control enforced in the HTTP request path (such as `server.fs.allow`) is not applied to this WebSocket-based execution path.

The advisory includes a PoC contrasting blocked HTTP `/@fs/...` access with successful WebSocket retrieval.

### References (from advisory)

- https://github.com/vitejs/vite/security/advisories/GHSA-p9ff-h696-f583  
- https://github.com/vitejs/vite/pull/22159  
- https://github.com/vitejs/vite/commit/f02d9fde0b195afe3ea2944414186962fbbe41e0  
- https://github.com/vitejs/vite/releases/tag/v6.4.2  
- https://github.com/vitejs/vite/releases/tag/v7.3.2  
- https://github.com/vitejs/vite/releases/tag/v8.0.5  
- https://nvd.nist.gov/vuln/detail/CVE-2026-39363  

---

## Proposed remediation (for implementer)

1. **Vite (#57, #58, #59):** Raise the resolved **Vite** version to **≥ 7.3.2** (or newer compatible with Astro 6), typically by upgrading **Astro** / refreshing the lockfile so the transitive `vite` tree picks up the patched release. At snapshot time the lockfile listed **`vite@7.3.1`** (vulnerable to all three).  
2. **yaml (#56):** Ensure **every** instance of `yaml` in the lockfile is **≥ 2.8.3** (or **≥ 1.10.3** on the 1.x line). If a dependency still pins **2.7.x**, use **`overrides`** in `package.json` or wait for/upstream bump of the parent package.  
3. Run **`npm install`**, **`npm run build`** (and **`npm audit`** if useful), then confirm Dependabot clears **#56–#59** after the default scan.

## Risk / exposure note (static site)

This project builds **static** output; **Vite’s dev server** is primarily a **local development** concern. The advisory text still recommends treating dev-server exposure (`--host` / network binding) as the sensitive case. Production **GitHub Pages** serving does not run the Vite dev server.

## Checklist

- [ ] Lockfile updated; no vulnerable `vite` / `yaml` per ranges above  
- [ ] `npm run build` passes  
- [ ] Dependabot alerts 56–59 resolved or documented if dismissed with reason  

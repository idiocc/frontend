## 27 February 2020

### [2.0.2](https://github.com/idiocc/frontend/compare/v2.0.1...v2.0.2)

- [fix] Upd dependencies to fix Node 12.
- [ci] Add _Github Actions_.

## 25 December 2019

### [2.0.1](https://github.com/idiocc/frontend/compare/v2.0.0...v2.0.1)

- [package] Add `typedefs.json` to _files_.

### [2.0.0](https://github.com/idiocc/frontend/compare/v1.6.0...v2.0.0)

- [license] Update to _Affero GPL_.
- [compile] Compile the package with `depack`.

## 5 September 2019

### [1.6.0](https://github.com/idiocc/frontend/compare/v1.5.0...v1.6.0)

- [feature] Add `mount` point.
- [feature] Allow to pass multiple directories.
- [feature] Support overriding of `node_modules`.

## 16 April 2019

### [1.5.0](https://github.com/idiocc/frontend/compare/v1.4.5...v1.5.0)

- [feature] Implement caching using `mtime`.

### [1.4.5](https://github.com/idiocc/frontend/compare/v1.4.4...v1.4.5)

- [fix] Fix resolving paths with leading `/`, e.g., `import 'preact/devtools/`.
- [deps] Up deps.
- [test] Remove _SnapshotContext_.

## 4 April 2019

### [1.4.4](https://github.com/idiocc/frontend/compare/v1.4.3...v1.4.4)

- [deps] Unfix dependencies.

## 2 March 2019

### 1.4.3

- [deps] Update dependencies (pass through `true` boolean attribute).

## 26 February 2019

### 1.4.2

- [deps] Update dependencies.

## 19 February 2019

### 1.4.1

- [deps] Update dependencies.

## 10 February 2019

### 1.4.0

- [feature] Resolve `node_modules` entries.
- [feature] Resolve using FindPackageJson instead of `require.resolve` to serve linked packages.
- [fix] Don't override local dependencies' paths.

## 8 February 2019

### 1.3.0

- [feature] Update direct references such as `import 'package'`.

## 7 February 2019

### 1.2.4

- [feature] Throw an error when `frontend` directory does not exist.

### 1.2.3

- [package] Fix JSDoc documentation and up `@a-la/jsx`.

## 5 February 2019

### 1.2.2

- [dep] Install `resolve-dependency`.

## 31 January 2019

### 1.2.1

- [fix] Update `@a-la/jsx` to correctly parse inner self-closing tags.

### 1.2.0

- [feature] Update packages from `node_modules`.
- [feature] Require explicit dependencies, e.g., `preact/src/preact`.

## 30 January 2019

### 1.1.0

- [feature] Automatically add `pragma`.

## 27 January 2019

### 1.0.0

- Create `@idio/frontend` with [`mnp`][https://mnpjs.org]
- [repository]: `src`, `test`

# pg-helpers
A wrapper library for the [pg](https://www.npmjs.com/package/pg) npm package.

## Installation
`npm install @oly_op/pg-helpers`

## Usage
The package exports helpers which you can import individually.

`import {  query, parseTable } from "@oly_op/pg-helpers"`

## API

Query function
* `query`

Result parsing helpers:
* `parseRow`
* `parseTable`
* `getResRow`
* `getRowCount`
* `getResExists`
* `getRowCountOrNull`
* `isResEmpty`
* `convertToCamelCase`
* `convertToSnakeCase`

Types:
```typescript
import type { Pool, PoolClient, QueryResult } from "pg"

export type Client = Pool | PoolClient

export type QueryRes<T = Record<string, unknown>> = QueryResult<T>

export type Parse<T> = (res: QueryRes) => T

export interface Variable {
	key: string,
	string?: boolean,
	parameterized?: boolean,
	value: string | number | boolean | null,
}
```

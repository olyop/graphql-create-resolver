# graphql-create-resolver

A simple utility that assists you in creating your GraphQL resolver functions.

Can be used in any [GraphQL.js](https://graphql.org/graphql-js/) server integration.

### Features

- If you use TypeScript, it allows you to type the four resolver function arguments `(parent, args, context, info)` easily with Generics and only once!
- Allows you to check the context in every resolvers using the `checkContext` function. This can be useful if you want to check the authentication/authorization for all resolvers.

## Installation

```bash
npm i @oly_op/graphql-create-resolver
```

## TypeScript Support

This package contains built-in TypeScript definitions.

## Getting Started

You first have to create a root create resolver function:

```typescript
import { createRootResolver } from "@oly_op/graphql-create-resolver";

const createResolver = createRootResolver();
```

Then for each root resolver field you have to create a new createResolver function.
Here is the where you could parse in the parent type to the resolver.

For example for the Query field:

```typescript
const queryResolver = createResolver();

const helloWorldQueryResolver = resolver(({ parent, context, args, info }) => "Hello World!");
```

`helloWorldQueryResolver` is a function with the standard resolver signature `(parent, context, args, info) => any` ready to be parsed into in any GraphQL framework.

## Usage with TypeScript

```typescript
import { GraphQLResolveInfo } from "graphql";

type CreateResolverCheckContextFunction<C> = (context: C) => void;

interface CreateResolverParameter<P, A, C> {
	args: A;
	parent: P;
	context: C;
	info: GraphQLResolveInfo;
}

type CreateResolverCallback<P, A, C, R> = (
	props: CreateResolverParameter<P, A, C>,
) => R | Promise<R>;

type creteRootResolver = <C = undefined>(
	checkContextFunction?: CreateResolverCheckContextFunction<C>,
) => <P = undefined>() => <R, A = undefined>(
	callback: CreateResolverCallback<P, A, C, R>,
	checkContext?: boolean,
) => (parent: P, args: A, context: C, info: GraphQLResolveInfo) => R | Promise<R>;
```

## Examples

### Apollo Server Fastify:

```typescript
import { ApolloServer } from "apollo-server-fastify";

const apollo = new ApolloServer({
	context,
	typeDefs,
	resolvers: {
		Query: {
			helloWorld: helloWorldQueryResolver,
		},
	},
});
```

### Example with Context and Args typings:

```typescript
import { createRootResolver } from "@oly_op/graphql-create-resolver";

interface Context {
	database: SomeDataBaseClient;
}

const createResolver = createRootResolver<Context>();

const queryResolver = createResolver();

interface Args {
	greetingWord: string;
}

const greetingQueryResolver = resolver<string, Args>(async ({ parent, context, args, info }) => {
	const { database } = context;
	const { greetingWord } = args;
	const userName = await database.getUser();
	return `${greetingWord} ${userName}`;
});

const resolvers = {
	Query: {
		greeting: greetingQueryResolver,
	},
};
```

### Example with Context and Parent typings:

```typescript
import { createRootResolver } from "@oly_op/graphql-create-resolver";
import { AuthenticationError } from "apollo-server-fastify";

interface Context {
	authorization?: string;
	database: SomeDataBaseClient;
}

const createResolver = createRootResolver<Context>(({ authorization }) => {
	if (authorization === undefined) {
		throw new AuthenticationError("Token error");
	}
});

interface User {
	name: string;
	userID: string;
}

const userResolver = createResolver<User>();

interface Args {
	showPrivatePlaylists: string;
}

const userPlaylistsResolver = resolver<Playlist[], Args>(({ parent, context, args, info }) => {
	const { userID } = parent;
	const { database } = context;
	const { showPrivatePlaylists } = args;
	return database.getUserPlaylists(userID, { showPrivatePlaylists });
});

const resolvers = {
	User: {
		userPlaylists: userPlaylistsResolver,
	},
};
```

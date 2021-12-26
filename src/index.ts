import { GraphQLResolveInfo } from "graphql"

export type CheckContextFunction<C> =
	(context: C) => void

export interface Parameter<P, A, C> {
	args: A,
	parent: P,
	context: C,
	info: GraphQLResolveInfo,
}

export interface CheckContextOptions {
	parentContext?: boolean,
	globalContext?: boolean,
}

export interface Options {
	check: CheckContextOptions,
}

export type Callback<P, A, C, R> =
	(props: Parameter<P, A, C>) => R | Promise<R>

export const createRootResolver =
	<C = undefined>(globalCheckContextFunction?: CheckContextFunction<C>) =>
		<P = undefined>(parentCheckContextFunction?: CheckContextFunction<C>) =>
			<R, A = undefined>(callback: Callback<P, A, C, R>, options: Options) =>
				(parent: P, args: A, context: C, info: GraphQLResolveInfo) => {
					const {
						globalContext = true,
						parentContext = true,
					} = options.check

					if (globalContext && globalCheckContextFunction) {
						globalCheckContextFunction(context)
					}

					if (parentContext && parentCheckContextFunction) {
						parentCheckContextFunction(context)
					}

					return callback({ parent, args, context, info })
				}
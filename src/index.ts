import { GraphQLResolveInfo } from "graphql"

export type CreateResolverCheckContextFunction<C> =
	(context: C) => void

export interface CreateResolverParameter<P, A, C> {
	args: A,
	parent: P,
	context: C,
	info: GraphQLResolveInfo,
}

export type CreateResolverCallback<P, A, C, R> =
	(props: CreateResolverParameter<P, A, C>) => R | Promise<R>

export const createRootResolver =
	<C = undefined>(checkContextFunction: CreateResolverCheckContextFunction<C>) =>
		<P = undefined>() =>
			<R, A = undefined>(callback: CreateResolverCallback<P, A, C, R>, checkContext = true) =>
				(parent: P, args: A, context: C, info: GraphQLResolveInfo) => {
					if (checkContext) {
						checkContextFunction(context)
					}
					return callback({ parent, args, context, info })
				}
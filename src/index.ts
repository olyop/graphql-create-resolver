import { GraphQLResolveInfo } from "graphql"

export interface ParameterParent<P> {
	parent: P,
}

export interface ParameterContext<C> {
	context: C,
}

export interface Parameter<P, A, C>
	extends ParameterParent<P>, ParameterContext<C> {
	args: A,
	info: GraphQLResolveInfo,
}

export interface CheckContextFunctionOptions<C, P = undefined>
	extends ParameterContext<C>, Partial<ParameterParent<P>> {}

export type CheckContextFunction<C> =
	(parameter: ParameterContext<C>) => void

export interface CheckParentContextFunctionOptions<P, C>
	extends ParameterParent<P>, ParameterContext<C> {}

export type CheckParentContextFunction<P, C> =
	(parameter: CheckParentContextFunctionOptions<P, C>) => void

export interface CheckContextOptions {
	global?: boolean,
	parent?: boolean,
}

export type Callback<P, A, C, R> =
	(props: Parameter<P, A, C>) => Promise<R>

export const createRootResolver =
	<C = undefined>(globalCheckContextFunction?: CheckContextFunction<C>) =>
		<P = undefined>(parentCheckContextFunction?: CheckParentContextFunction<P, C>) =>
			<R, A = undefined>(callback: Callback<P, A, C, R>, inputCheckContextOptions?: CheckContextOptions) =>
				(parent: P, args: A, context: C, info: GraphQLResolveInfo) => {
					const checkContextOptions: CheckContextOptions = {
						global: true,
						parent: true,
						...inputCheckContextOptions || {},
					}

					if (checkContextOptions.global && globalCheckContextFunction) {
						globalCheckContextFunction({ context })
					}
					if (checkContextOptions.parent && parentCheckContextFunction) {
						parentCheckContextFunction({ context, parent })
					}
					return callback({ parent, args, context, info })
				}
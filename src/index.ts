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

export interface CheckOptions {
	globalContext?: boolean,
	parentContext?: boolean,
}

export type Callback<P, A, C, R> =
	(props: Parameter<P, A, C>) => R | Promise<R>

export const createRootResolver =
	<C = undefined>(globalCheckContextFunction?: CheckContextFunction<C>) =>
		<P = undefined>(parentCheckContextFunction?: CheckParentContextFunction<P, C>) =>
			<R, A = undefined>(callback: Callback<P, A, C, R>, inputCheckOptions?: CheckOptions) =>
				(parent: P, args: A, context: C, info: GraphQLResolveInfo) => {
					const checkOptions: CheckOptions = {
						globalContext: true,
						parentContext: true,
						...inputCheckOptions || {},
					}

					if (checkOptions.globalContext && globalCheckContextFunction) {
						globalCheckContextFunction({ context })
					}

					if (checkOptions.parentContext && parentCheckContextFunction) {
						parentCheckContextFunction({ context, parent })
					}

					return callback({ parent, args, context, info })
				}
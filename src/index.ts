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

export interface CheckGlobalContextFunctionOptions<P, C>
	extends ParameterParent<P>, ParameterContext<C> {}

export type CheckGlobalContextFunction<P, C> =
	(parameter: CheckGlobalContextFunctionOptions<P, C>) => void

export interface CheckContextOptions {
	parentContext?: boolean,
	globalContext?: boolean,
}

export type Callback<P, A, C, R> =
	(props: Parameter<P, A, C>) => R | Promise<R>

export const createRootResolver =
	<C = undefined>(globalCheckContextFunction?: CheckContextFunction<C>) =>
		<P = undefined>(parentCheckContextFunction?: CheckGlobalContextFunction<P, C>) =>
			<R, A = undefined>(callback: Callback<P, A, C, R>, checkOptions?: CheckContextOptions) =>
				(parent: P, args: A, context: C, info: GraphQLResolveInfo) => {
					const normalizedCheckOptions: CheckContextOptions = {
						globalContext: true,
						parentContext: true,
						...checkOptions || {},
					}

					if (normalizedCheckOptions.globalContext && globalCheckContextFunction) {
						globalCheckContextFunction({ context })
					}

					if (normalizedCheckOptions.parentContext && parentCheckContextFunction) {
						parentCheckContextFunction({ context, parent })
					}

					return callback({ parent, args, context, info })
				}
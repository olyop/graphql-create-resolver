import type { GraphQLFieldResolver, GraphQLResolveInfo } from "graphql";

export interface ParameterParent<Parent> {
	parent: Parent;
}

export interface ParameterContext<Context> {
	context: Context;
}

export interface ParameterArguments<Arguments> {
	args: Arguments;
}

export interface ParameterInfo {
	info: GraphQLResolveInfo;
}

export interface Parameter<Parent, Arguments, Context>
	extends ParameterInfo,
		ParameterParent<Parent>,
		ParameterContext<Context>,
		ParameterArguments<Arguments> {}

export interface CheckContextFunctionOptions<Context, Parent = undefined>
	extends ParameterContext<Context>,
		Partial<ParameterParent<Parent>> {}

export type CheckContextFunction<Context> = (parameter: ParameterContext<Context>) => void;

export interface CheckParentContextFunctionOptions<Parent, Context>
	extends ParameterParent<Parent>,
		ParameterContext<Context> {}

export type CheckParentContextFunction<Parent, Context> = (
	parameter: CheckParentContextFunctionOptions<Parent, Context>,
) => void;

export interface CheckContextOptions {
	global?: boolean;
	parent?: boolean;
}

export type Callback<Parent, Arguments, Context, Return> = (
	props: Parameter<Parent, Arguments, Context>,
) => Promise<Return>;

export const createRootResolver =
	<Context = undefined>(globalCheckContextFunction?: CheckContextFunction<Context>) =>
	<Parent = undefined>(parentCheckContextFunction?: CheckParentContextFunction<Parent, Context>) =>
	<Return, Arguments = undefined>(
		callback: Callback<Parent, Arguments, Context, Return>,
		inputCheckContextOptions?: CheckContextOptions,
	): GraphQLFieldResolver<Parent, Context, Arguments> =>
	(parent, args, context, info) => {
		const checkContextOptions: CheckContextOptions = {
			global: true,
			parent: true,
			...inputCheckContextOptions,
		};

		if (checkContextOptions.global && globalCheckContextFunction) {
			globalCheckContextFunction({ context });
		}

		if (checkContextOptions.parent && parentCheckContextFunction) {
			parentCheckContextFunction({ context, parent });
		}

		return callback({ parent, args, context, info });
	};

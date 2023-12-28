import builder from '../builder';
import { ZodError, ZodFormattedError } from 'zod';

const ErrorInterface = builder.interfaceRef<Error>('Error').implement({
	fields: (t) => ({
		message: t.exposeString('message'),
	}),
});

// Util for flattening zod errors into something easier to represent in your Schema.
function flattenErrors(
	error: ZodFormattedError<unknown>,
	path: string[]
): { path: string[]; message: string }[] {
	// eslint-disable-next-line no-underscore-dangle
	const errors = error._errors.map((message) => ({
		path,
		message,
	}));

	Object.keys(error).forEach((key) => {
		if (key !== '_errors') {
			errors.push(
				...flattenErrors(
					(error as Record<string, unknown>)[
						key
					] as ZodFormattedError<unknown>,
					[...path, key]
				)
			);
		}
	});

	return errors;
}

// A type for the individual validation issues
const ZodFieldError = builder
	.objectRef<{
		message: string;
		path: string[];
	}>('ZodFieldError')
	.implement({
		fields: (t) => ({
			message: t.exposeString('message'),
			path: t.exposeStringList('path'),
		}),
	});

// The actual error type
builder.objectType(ZodError, {
	name: 'ZodError',
	interfaces: [ErrorInterface],
	fields: (t) => ({
		fieldErrors: t.field({
			type: [ZodFieldError],
			resolve: (err) => flattenErrors(err.format(), []),
		}),
	}),
});

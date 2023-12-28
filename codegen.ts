import { type CodegenConfig } from '@graphql-codegen/cli';
import { printSchema } from 'graphql';
import schema from './src/schema';

const config: CodegenConfig = {
	schema: printSchema(schema),
	generates: {
		'schema.graphql': {
			plugins: ['schema-ast'],
		},
	},
};
export default config;

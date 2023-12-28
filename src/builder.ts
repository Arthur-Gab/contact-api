import SchemaBuilder from '@pothos/core';

// Prisma Plugin
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import PrismaPlugin from '@pothos/plugin-prisma';
import prisma from './prisma';

// Error Plugin
import ErrorsPlugin from '@pothos/plugin-errors';

// Validation Plugin
import ValidationPlugin from '@pothos/plugin-validation';
import { ZodError } from 'zod';

export const builder = new SchemaBuilder<{
	PrismaTypes: PrismaTypes;
}>({
	plugins: [ErrorsPlugin, ValidationPlugin, PrismaPlugin],
	prisma: {
		client: prisma,
	},
	errorOptions: {
		defaultTypes: [ZodError],
	},
});

// Initializing Query and Mutation Types
builder.queryType({});
builder.mutationType({});

export default builder;

import { Prisma } from '@prisma/client';
import builder from '../builder';
import prisma from '../prisma';
import z, { ZodError } from 'zod';
import { GraphQLError } from 'graphql';

builder.queryField('getAllContacts', (t) =>
	t.prismaField({
		type: ['Contact'],
		nullable: {
			list: false,
			items: true,
		},
		resolve: async () => prisma.contact.findMany(),
	})
);

builder.mutationField('createContact', (t) =>
	t.prismaField({
		type: 'Contact',
		// Throw Error with Args
		errors: {},
		nullable: true,
		args: {
			input: t.arg({
				type: ContactInput,
				required: true,
				validate: {
					type: 'object',
					schema: z
						.object({
							name: z.string({
								required_error: 'Missing name prop',
							}),
							email: z.string({
								required_error: 'Missing email prop',
							}),
							phone: z.string({
								required_error: 'Missing phone prop',
							}),
						})
						.required(),
				},
			}),
		},
		resolve: async (query, root, args) => {
			try {
				const contact = await prisma.contact.create({
					...query,
					data: args.input,
				});

				return contact;
			} catch (e) {
				if (e instanceof Prisma.PrismaClientKnownRequestError) {
					console.log(e.code);

					if (e.code === 'P2002') {
						throw new ZodError([
							{
								code: 'invalid_string',
								validation: 'email',
								path: ['createContact'],
								message:
									'There is a unique constraint violation, a new Contact cannot be created with this email',
							},
						]);
					}
				}

				throw new GraphQLError(`${e}`);
			}
		},
	})
);

builder.mutationField('updateContactById', (t) =>
	t.prismaField({
		type: 'Contact',
		nullable: true,
		errors: {},
		args: {
			id: t.arg.int({
				required: true,
			}),
			input: t.arg({
				type: ContactInput,
				required: true,
			}),
		},
		resolve: async (query, root, args) => {
			try {
				const updatedContact = await prisma.contact.update({
					...query,
					where: {
						id: args.id,
					},
					data: {
						...args.input,
					},
				});

				return updatedContact;
			} catch (e) {
				if (e instanceof Prisma.PrismaClientKnownRequestError) {
					console.log(e.code);

					if (e.code === 'P2025') {
						throw new ZodError([
							{
								code: 'unrecognized_keys',
								keys: [`${args.id}`],
								path: ['updateContactById'],
								message: `The provided id: ${args.id} does not exist on record!`,
							},
						]);
					}
				}

				throw new GraphQLError(`${e}`);
			}
		},
	})
);

// type Contact {}
builder.prismaObject('Contact', {
	description: `Contact model with unique IDs (id), covering: name, email and telephone. Guarantees email exclusivity, increasing data reliability.`,
	fields: (t) => ({
		id: t.exposeID('id'),
		name: t.exposeString('name'),
		email: t.exposeString('email'),
		phone: t.exposeString('phone'),
	}),
});

// input ContactInput {}
export const ContactInput =
	builder.inputRef<Prisma.ContactCreateInput>('ContactInput');

// Input Validations here
ContactInput.implement({
	fields: (t) => ({
		name: t.string(),
		email: t.string({
			validate: {
				email: [true, { message: 'Invalid email address' }],
			},
		}),
		phone: t.string({
			validate: {
				type: 'string',
				schema: z
					.string()
					.regex(
						new RegExp(
							/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
						),
						'Invalid phone number'
					),
			},
		}),
	}),
});

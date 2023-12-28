import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const contactsData: Prisma.ContactCreateInput[] = [
	{
		name: 'John Doe',
		email: 'john.doe@example.com',
		phone: '+1234567890',
	},
	{
		name: 'Jane Smith',
		email: 'jane.smith@example.com',
		phone: '+9876543210',
	},
	{
		name: 'Bob Johnson',
		email: 'bob.johnson@example.com',
		phone: '+1112233445',
	},
	{
		name: 'Alice Williams',
		email: 'alice.williams@example.com',
		phone: '+5556667777',
	},
	{
		name: 'Charlie Brown',
		email: 'charlie.brown@example.com',
		phone: '+9998887777',
	},
];

async function main() {
	console.log(`Starting seeding...`);

	for (const c of contactsData) {
		const contact = await prisma.contact.create({
			data: c,
		});

		console.log(`Created contact with ID: ${contact.id}`);
	}

	console.log(`Seeding finished...`);
}

await main()
	.catch(async (e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

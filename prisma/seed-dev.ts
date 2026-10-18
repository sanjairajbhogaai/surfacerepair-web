import { PrismaClient } from '@prisma/client';
import { randomBytes, createHash } from 'crypto';

const db = new PrismaClient();

function trackToken(): { raw: string; hash: string } {
  const raw = randomBytes(32).toString('base64url');
  const hash = createHash('sha256').update(raw).digest('hex');
  return { raw, hash };
}

async function main() {
  console.log('Seeding dev data…');

  const owner = await db.staffUser.upsert({
    where: { emailNormalized: 'owner@example.test' },
    update: {},
    create: {
      name: 'Dev Owner',
      email: 'owner@example.test',
      emailNormalized: 'owner@example.test',
      role: 'OWNER',
    },
  });

  await db.staffUser.upsert({
    where: { emailNormalized: 'staff@example.test' },
    update: {},
    create: {
      name: 'Dev Staff',
      email: 'staff@example.test',
      emailNormalized: 'staff@example.test',
      role: 'STAFF',
      invitedByStaffId: owner.id,
    },
  });

  const customer = await db.customer.upsert({
    where: { phoneNormalized: '919967990081' },
    update: {},
    create: {
      name: 'Priya Sharma',
      phone: '+919967990081',
      phoneNormalized: '919967990081',
      email: 'priya@example.test',
      emailNormalized: 'priya@example.test',
    },
  });

  const seq = await db.ticketSequence.upsert({
    where: { year: new Date().getFullYear() },
    update: { lastNumber: { increment: 3 } },
    create: { year: new Date().getFullYear(), lastNumber: 3 },
  });

  const tokens = [trackToken(), trackToken(), trackToken()];

  await db.request.create({
    data: {
      ticketId: `SR-${new Date().getFullYear()}-0001`,
      type: 'REPAIR',
      status: 'RECEIVED',
      customerId: customer.id,
      deviceCategory: 'SURFACE',
      deviceModel: 'Surface Pro 9',
      issueDescription: 'Screen flickers after opening the lid, battery drains quickly.',
      servicePreference: 'DROP_OFF',
      preferredContactTime: 'AFTERNOON',
      trackTokenHash: tokens[0]!.hash,
      statusEvents: {
        create: { status: 'RECEIVED', fromStatus: null },
      },
    },
  });

  await db.request.create({
    data: {
      ticketId: `SR-${new Date().getFullYear()}-0002`,
      type: 'REPAIR',
      status: 'DIAGNOSING',
      customerId: customer.id,
      deviceCategory: 'LAPTOP',
      deviceModel: 'Dell XPS 13',
      issueDescription: 'Will not power on. Charger light stays off. No fan spin.',
      trackTokenHash: tokens[1]!.hash,
      statusEvents: {
        create: [
          { status: 'RECEIVED', fromStatus: null },
          { status: 'DIAGNOSING', fromStatus: 'RECEIVED', changedByStaffId: owner.id, note: 'Diagnosis started.' },
        ],
      },
    },
  });

  await db.request.create({
    data: {
      ticketId: `SR-${new Date().getFullYear()}-0003`,
      type: 'BUSINESS_VISIT',
      status: 'RECEIVED',
      customerId: customer.id,
      issueDescription: 'Need on-site IT support for a 20-person office in Andheri.',
      companyName: 'Acme Traders',
      employeeCount: 20,
      deviceSummary: '18 Windows laptops, 1 server, 2 printers',
      servicesNeeded: ['On-site support', 'Networking'],
      preferredDateWindow: 'Next week, mornings',
      trackTokenHash: tokens[2]!.hash,
      statusEvents: {
        create: { status: 'RECEIVED', fromStatus: null },
      },
    },
  });

  console.log('Dev seed complete.');
  console.log('Owner login: owner@example.test');
  console.log('Staff login: staff@example.test');
  console.log('Sample tracking tokens written to DB (not printed for security).');
  console.log('Last ticket sequence number:', seq.lastNumber);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

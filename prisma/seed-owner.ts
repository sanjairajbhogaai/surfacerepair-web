import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  const ownerEmail = process.env.OWNER_EMAIL ?? process.env.EMAIL_TO_STAFF ?? 'admin@surfacerepair.in';
  const emailNormalized = ownerEmail.trim().toLowerCase();

  const existing = await db.staffUser.findUnique({ where: { emailNormalized } });
  if (existing) {
    console.log(`Owner already exists: ${ownerEmail}`);
    return;
  }

  const owner = await db.staffUser.create({
    data: {
      name: 'Owner',
      email: ownerEmail,
      emailNormalized,
      role: 'OWNER',
      isActive: true,
    },
  });

  await db.auditLog.create({
    data: {
      actorStaffId: null,
      action: 'OWNER_SEEDED',
      targetType: 'StaffUser',
      targetId: owner.id,
      metadata: { email: ownerEmail },
    },
  });

  console.log(`Owner created: ${ownerEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

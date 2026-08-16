// دادهٔ نمونهٔ محلی برای تست فاز ۱ (auth، Care Timeline، داشبورد).
// اجرا: npm run prisma:seed (idempotent — با id ثابت upsert می‌کند)
import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const facility = await prisma.facility.upsert({
    where: { id: "seed-facility" },
    update: {},
    create: {
      id: "seed-facility",
      name: "خانه سالمند نمونه",
      type: "NURSING_HOME",
      address: "تهران",
      phone: "02100000000",
    },
  });

  const passwordHash = hashSync("password123", 10);

  const admin = await prisma.user.upsert({
    where: { phone: "09120000001" },
    update: {},
    create: {
      id: "seed-user-admin",
      facilityId: facility.id,
      fullName: "ادمین نمونه",
      phone: "09120000001",
      passwordHash,
      role: "ADMIN",
    },
  });

  const nurse = await prisma.user.upsert({
    where: { phone: "09120000002" },
    update: {},
    create: {
      id: "seed-user-nurse",
      facilityId: facility.id,
      fullName: "پرستار نمونه",
      phone: "09120000002",
      passwordHash,
      role: "NURSE",
    },
  });

  const resident1 = await prisma.resident.upsert({
    where: { id: "seed-resident-1" },
    update: {},
    create: {
      id: "seed-resident-1",
      facilityId: facility.id,
      fullName: "زهرا احمدی",
      birthDate: new Date("1940-03-21"),
      gender: "FEMALE",
      roomNumber: "101",
      riskLevel: "HIGH",
      primaryDiagnosis: "فشار خون بالا",
      allergies: "پنی‌سیلین",
    },
  });

  const resident2 = await prisma.resident.upsert({
    where: { id: "seed-resident-2" },
    update: {},
    create: {
      id: "seed-resident-2",
      facilityId: facility.id,
      fullName: "حسن رضایی",
      birthDate: new Date("1945-07-10"),
      gender: "MALE",
      roomNumber: "102",
      riskLevel: "LOW",
    },
  });

  const shift = await prisma.shift.upsert({
    where: { id: "seed-shift-1" },
    update: {},
    create: {
      id: "seed-shift-1",
      facilityId: facility.id,
      staffId: nurse.id,
      type: "MORNING",
      status: "COMPLETED",
      startTime: new Date(new Date().setHours(7, 0, 0, 0)),
      endTime: new Date(new Date().setHours(15, 0, 0, 0)),
    },
  });

  await prisma.vitalSign.upsert({
    where: { id: "seed-vital-1" },
    update: {},
    create: {
      id: "seed-vital-1",
      residentId: resident1.id,
      shiftId: shift.id,
      recordedById: nurse.id,
      bloodPressureSystolic: 150,
      bloodPressureDiastolic: 95,
      heartRate: 88,
      temperature: 36.8,
      spo2: 96,
    },
  });

  const medication = await prisma.medication.upsert({
    where: { id: "seed-medication-1" },
    update: {},
    create: {
      id: "seed-medication-1",
      residentId: resident1.id,
      name: "آملودیپین",
      dosage: "5mg",
      frequency: "روزی یکبار - صبح",
      startDate: new Date(),
    },
  });

  await prisma.medicationAdministration.upsert({
    where: { id: "seed-medadmin-1" },
    update: {},
    create: {
      id: "seed-medadmin-1",
      medicationId: medication.id,
      residentId: resident1.id,
      shiftId: shift.id,
      administeredById: nurse.id,
      scheduledTime: new Date(new Date().setHours(8, 0, 0, 0)),
      status: "MISSED",
    },
  });

  await prisma.careNote.upsert({
    where: { id: "seed-carenote-1" },
    update: {},
    create: {
      id: "seed-carenote-1",
      residentId: resident1.id,
      shiftId: shift.id,
      authorId: nurse.id,
      category: "NUTRITION",
      content: "کاهش اشتها در وعدهٔ صبحانه — دو روز متوالی",
      severity: "CONCERN",
    },
  });

  await prisma.incidentReport.upsert({
    where: { id: "seed-incident-1" },
    update: {},
    create: {
      id: "seed-incident-1",
      residentId: resident1.id,
      shiftId: shift.id,
      reportedById: nurse.id,
      type: "FALL",
      description: "سقوط جزئی هنگام جابجایی از تخت به ویلچر",
      severity: "CONCERN",
      actionTaken: "بررسی توسط پرستار، بدون آسیب مشهود",
    },
  });

  await prisma.handoffNote.upsert({
    where: { id: "seed-handoff-1" },
    update: {},
    create: {
      id: "seed-handoff-1",
      shiftId: shift.id,
      residentId: resident1.id,
      fromStaffId: nurse.id,
      content: "علائم حیاتی کمی بالاتر از baseline — پیگیری شود.",
      priority: "MEDIUM",
    },
  });

  console.log("Seed کامل شد:", {
    facility: facility.name,
    users: [admin.phone, nurse.phone],
    residents: [resident1.fullName, resident2.fullName],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

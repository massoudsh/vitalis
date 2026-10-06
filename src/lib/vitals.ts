import { z } from "zod";

const optionalInt = (min: number, max: number) =>
  z.number().int().min(min).max(max).optional();
const optionalNumber = (min: number, max: number) =>
  z.number().min(min).max(max).optional();

export const createVitalSignSchema = z
  .object({
    bloodPressureSystolic: optionalInt(50, 260),
    bloodPressureDiastolic: optionalInt(30, 160),
    heartRate: optionalInt(20, 240),
    temperature: optionalNumber(30, 45),
    spo2: optionalInt(50, 100),
    respiratoryRate: optionalInt(4, 80),
    bloodSugar: optionalNumber(10, 800),
    weightKg: optionalNumber(20, 300),
    notes: z.string().trim().max(500).optional(),
  })
  .refine(
    (v) =>
      v.bloodPressureSystolic === undefined ||
      v.bloodPressureDiastolic === undefined ||
      v.bloodPressureSystolic > v.bloodPressureDiastolic,
    { message: "فشار سیستولیک باید از دیاستولیک بیشتر باشد", path: ["bloodPressureSystolic"] },
  )
  .refine(
    (v) =>
      Object.entries(v).some(
        ([key, value]) => key !== "notes" && value !== undefined,
      ),
    { message: "حداقل یک مقدار علائم حیاتی لازم است" },
  );

export type CreateVitalSignInput = z.infer<typeof createVitalSignSchema>;

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export function normalizeDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)))
    .replace(/٫/g, ".");
}

export function parseOptionalNumber(value: FormDataEntryValue | null): number | undefined {
  if (typeof value !== "string") return undefined;
  const normalized = normalizeDigits(value.trim());
  if (normalized === "") return undefined;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

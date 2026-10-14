import { z } from "zod";

export const careRecordSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("CARE_NOTE"), category: z.enum(["NUTRITION", "SLEEP", "BEHAVIOR", "PAIN", "HYGIENE", "MOOD", "MOBILITY", "OTHER"]), content: z.string().trim().min(2).max(2000), severity: z.enum(["NORMAL", "WATCH", "CONCERN", "URGENT"]) }),
  z.object({ type: z.literal("INCIDENT"), incidentType: z.enum(["FALL", "PRESSURE_ULCER", "INJURY", "MEDICATION_ERROR", "BEHAVIORAL_EVENT", "OTHER"]), description: z.string().trim().min(2).max(2000), severity: z.enum(["NORMAL", "WATCH", "CONCERN", "URGENT"]), actionTaken: z.string().trim().max(2000).optional(), familyNotified: z.boolean().optional() }),
  z.object({ type: z.literal("MEDICATION"), name: z.string().trim().min(2).max(200), dosage: z.string().trim().min(1).max(100), route: z.enum(["ORAL", "INJECTION", "TOPICAL", "INHALED", "OTHER"]), frequency: z.string().trim().min(1).max(100), instructions: z.string().trim().max(1000).optional() }),
  z.object({ type: z.literal("MEDICATION_ADMINISTRATION"), medicationId: z.string().min(1), status: z.enum(["GIVEN", "MISSED", "REFUSED", "DELAYED"]), notes: z.string().trim().max(1000).optional() }),
]);

export const residentUpdateSchema = z.object({ fullName: z.string().trim().min(2).max(120), roomNumber: z.string().trim().max(30).optional(), riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]), primaryDiagnosis: z.string().trim().max(1000).optional(), allergies: z.string().trim().max(1000).optional(), status: z.enum(["ACTIVE", "DISCHARGED", "DECEASED"]) });

export const shiftSchema = z.object({ type: z.enum(["MORNING", "EVENING", "NIGHT"]), staffId: z.string().min(1), startTime: z.string().datetime(), endTime: z.string().datetime() }).refine((v) => new Date(v.endTime) > new Date(v.startTime), { message: "زمان پایان باید پس از شروع باشد" });

export const handoffSchema = z.object({ shiftId: z.string().min(1), residentId: z.string().optional(), content: z.string().trim().min(2).max(4000), priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]) });

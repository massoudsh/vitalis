import { describe, expect, it } from "vitest";
import {
  createVitalSignSchema,
  normalizeDigits,
  parseOptionalNumber,
} from "./vitals";

describe("createVitalSignSchema", () => {
  it("accepts a valid partial set of vitals", () => {
    expect(
      createVitalSignSchema.safeParse({ heartRate: 72, spo2: 97 }).success,
    ).toBe(true);
  });

  it("rejects a record with no measurements", () => {
    expect(createVitalSignSchema.safeParse({ notes: "فقط یادداشت" }).success).toBe(false);
  });

  it("rejects systolic pressure not above diastolic", () => {
    const result = createVitalSignSchema.safeParse({
      bloodPressureSystolic: 80,
      bloodPressureDiastolic: 90,
    });
    expect(result.success).toBe(false);
  });

  it("rejects out-of-range values", () => {
    expect(createVitalSignSchema.safeParse({ spo2: 140 }).success).toBe(false);
    expect(createVitalSignSchema.safeParse({ temperature: 12 }).success).toBe(false);
  });
});

describe("digit normalization", () => {
  it("converts Persian and Arabic digits", () => {
    expect(normalizeDigits("۳۶٫۸")).toBe("36.8");
    expect(normalizeDigits("٩٧")).toBe("97");
  });

  it("parses empty input as undefined and invalid input as NaN", () => {
    expect(parseOptionalNumber("")).toBeUndefined();
    expect(parseOptionalNumber(null)).toBeUndefined();
    expect(parseOptionalNumber("۷۲")).toBe(72);
    expect(Number.isNaN(parseOptionalNumber("abc"))).toBe(true);
  });
});

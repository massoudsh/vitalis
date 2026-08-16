import { describe, expect, it } from "vitest";
import {
  hasRepeatedConcerningNotes,
  hasRepeatedMissedMedication,
  isVitalOutlier,
} from "./insights";

describe("hasRepeatedMissedMedication", () => {
  it("returns false when missed count is below threshold", () => {
    const admins = [{ status: "GIVEN" }, { status: "MISSED" }, { status: "GIVEN" }] as const;
    expect(hasRepeatedMissedMedication([...admins])).toBe(false);
  });

  it("returns true when missed count reaches default threshold (3)", () => {
    const admins = [
      { status: "MISSED" },
      { status: "MISSED" },
      { status: "MISSED" },
      { status: "GIVEN" },
    ] as const;
    expect(hasRepeatedMissedMedication([...admins])).toBe(true);
  });

  it("respects a custom threshold", () => {
    const admins = [{ status: "MISSED" }, { status: "MISSED" }] as const;
    expect(hasRepeatedMissedMedication([...admins], 2)).toBe(true);
  });
});

describe("isVitalOutlier", () => {
  const baseline = { avgSystolic: 120, avgHeartRate: 70 };

  it("returns false for a reading within tolerance", () => {
    expect(isVitalOutlier({ bloodPressureSystolic: 125, heartRate: 72 }, baseline)).toBe(false);
  });

  it("returns true when systolic deviates beyond tolerance", () => {
    expect(isVitalOutlier({ bloodPressureSystolic: 160, heartRate: 72 }, baseline)).toBe(true);
  });

  it("returns true when heart rate deviates beyond tolerance", () => {
    expect(isVitalOutlier({ bloodPressureSystolic: 120, heartRate: 100 }, baseline)).toBe(true);
  });

  it("ignores null readings", () => {
    expect(isVitalOutlier({ bloodPressureSystolic: null, heartRate: null }, baseline)).toBe(
      false,
    );
  });
});

describe("hasRepeatedConcerningNotes", () => {
  it("returns false when below threshold", () => {
    const notes = [{ severity: "NORMAL" }, { severity: "CONCERN" }] as const;
    expect(hasRepeatedConcerningNotes([...notes])).toBe(false);
  });

  it("returns true when reaching default threshold (2), mixing CONCERN and URGENT", () => {
    const notes = [{ severity: "CONCERN" }, { severity: "URGENT" }] as const;
    expect(hasRepeatedConcerningNotes([...notes])).toBe(true);
  });
});

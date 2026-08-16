// هستهٔ منطقی AI Insight — نسخهٔ rule-based (طبق docs/MVP_SCOPE.md بخش ۷ و
// docs/wiki/concepts/ai-layer.md). این توابع خالص و بدون وابستگی به دیتابیس‌اند
// تا مستقل تست شوند؛ اتصال به AIInsight/UI در قدم بعدی فاز ۱ انجام می‌شود.

export type MedicationAdminStatus = "GIVEN" | "MISSED" | "REFUSED" | "DELAYED";
export type Severity = "NORMAL" | "WATCH" | "CONCERN" | "URGENT";

/**
 * دارو فراموش‌شده مکرر: اگر از N رکورد اخیر، حداقل `threshold` مورد MISSED باشد.
 */
export function hasRepeatedMissedMedication(
  recentAdministrations: { status: MedicationAdminStatus }[],
  threshold = 3,
): boolean {
  const missedCount = recentAdministrations.filter((a) => a.status === "MISSED").length;
  return missedCount >= threshold;
}

export type VitalBaseline = {
  avgSystolic: number;
  avgHeartRate: number;
};

export type VitalReading = {
  bloodPressureSystolic: number | null;
  heartRate: number | null;
};

/**
 * افت/افزایش غیرعادی علائم حیاتی نسبت به baseline سالمند (آستانهٔ نسبی ساده).
 */
export function isVitalOutlier(
  reading: VitalReading,
  baseline: VitalBaseline,
  toleranceRatio = 0.2,
): boolean {
  if (
    reading.bloodPressureSystolic != null &&
    Math.abs(reading.bloodPressureSystolic - baseline.avgSystolic) >
      baseline.avgSystolic * toleranceRatio
  ) {
    return true;
  }
  if (
    reading.heartRate != null &&
    Math.abs(reading.heartRate - baseline.avgHeartRate) >
      baseline.avgHeartRate * toleranceRatio
  ) {
    return true;
  }
  return false;
}

/**
 * تکرار یادداشت مراقبتی با شدت «نگران‌کننده»/«فوری» در بازهٔ اخیر.
 */
export function hasRepeatedConcerningNotes(
  recentNotes: { severity: Severity }[],
  threshold = 2,
): boolean {
  const concerningCount = recentNotes.filter(
    (n) => n.severity === "CONCERN" || n.severity === "URGENT",
  ).length;
  return concerningCount >= threshold;
}

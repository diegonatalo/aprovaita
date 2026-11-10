import { describe, expect, it } from "vitest";
import { formatScore, formatTime } from "@/lib/format";

describe("formatTime", () => {
  it("formata segundos como HH:MM:SS", () => {
    expect(formatTime(0)).toBe("00:00:00");
    expect(formatTime(65)).toBe("00:01:05");
    expect(formatTime(3600)).toBe("01:00:00");
    expect(formatTime(10800)).toBe("03:00:00");
  });

  it("não devolve tempo negativo e arredonda os segundos", () => {
    expect(formatTime(-5)).toBe("00:00:00");
    expect(formatTime(59.6)).toBe("00:01:00");
  });
});

describe("formatScore", () => {
  it("usa vírgula e uma casa decimal", () => {
    expect(formatScore(72.5)).toBe("72,5");
    expect(formatScore(100)).toBe("100,0");
    expect(formatScore(0)).toBe("0,0");
  });
});

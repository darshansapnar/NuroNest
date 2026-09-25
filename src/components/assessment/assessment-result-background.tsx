import Image from "next/image";

/**
 * Shared decorative backdrop for every assessment result page (WHO-5, GAD-7,
 * PHQ-9, PSS-10, PSQI). Fixed to the viewport so it stays calm and in place
 * behind result cards no matter how tall a given result page scrolls.
 */
export function AssessmentResultBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#FBF9F4]"
    >
      <Image
        src="/images/assess-background.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
    </div>
  );
}

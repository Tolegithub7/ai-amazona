"use client";
import { useRouter } from "next/navigation";

export default function VariationArrow({ direction, targetId }: { direction: "left" | "right"; targetId: string | null }) {
  const router = useRouter();
  if (!targetId) return <div style={{ width: 32, height: 32 }} />;
  return (
    <button
      className="p-2 rounded-full bg-muted hover:bg-primary/20 transition-colors"
      onClick={() => router.push(`/products/${targetId}`)}
      aria-label={direction === "left" ? "Previous product" : "Next product"}
      style={{ minWidth: 32, minHeight: 32 }}
    >
      {direction === "left" ? (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
      ) : (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
      )}
    </button>
  );
} 
"use client";

import { LoaderContent } from "@/components/ui/loader-content";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#05060d]">
      <LoaderContent />
    </div>
  );
}

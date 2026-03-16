"use client";

import { useEffect, useState } from "react";
import { Link2, Twitter, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ShareSticky({ title, url }: { title: string; url: string }) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky after scrolling past the hero section (approx 33vh)
      if (window.scrollY > window.innerHeight * 0.33) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, "_blank");
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
  };

  return (
    <div
      className={`flex justify-center my-8 md:my-0 md:fixed md:left-8 md:top-1/2 md:-translate-y-1/2 md:flex-col md:gap-3 transition-all duration-300 z-50 ${
        isSticky ? "md:opacity-100 md:translate-x-0" : "md:opacity-0 md:-translate-x-10 md:pointer-events-none"
      }`}
    >
      <div className="bg-background/80 backdrop-blur-md border rounded-full p-2 flex flex-row md:flex-col gap-2 shadow-lg">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" onClick={shareTwitter} title="Share on Twitter">
          <Twitter className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" onClick={shareFacebook} title="Share on Facebook">
          <Facebook className="h-4 w-4" />
        </Button>
        <div className="h-6 w-0 border-l md:h-auto md:w-8 md:border-l-0 md:border-b mx-1 md:mx-auto my-auto md:my-1"></div>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" onClick={handleCopyLink} title="Copy Link">
          <Link2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

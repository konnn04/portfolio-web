export function Footer() {
  return (
    <footer className="py-8 mt-16">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground mb-14 md:mb-0">
        © {new Date().getFullYear()} My Portfolio. All rights reserved.
      </div>
    </footer>
  );
}
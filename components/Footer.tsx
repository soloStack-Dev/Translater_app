import Link from "next/link";

const footerLinks = [
  { label: "Privacy Policy", href: "/" },
  { label: "Terms of Service", href: "/" },
  { label: "Contact Us", href: "/" },
  { label: "Careers", href: "/" },
];

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#F0F0F0]">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <p className="text-lg font-bold text-[#7A5C6B]">Aura AI</p>
          <p className="text-xs text-[#9CA3AF] mt-1">
            © 2024 Aura AI. Crafted with love.
          </p>
        </div>
        <ul className="flex flex-wrap gap-6">
          {footerLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm text-[#9CA3AF] transition-colors hover:text-[#7A5C6B]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

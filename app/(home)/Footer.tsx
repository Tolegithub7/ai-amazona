import Link from "next/link";

const footerLinks = [
  {
    title: "Get to Know Us",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press Releases", href: "/press" },
      { label: "Amazon Science", href: "/science" },
    ],
  },
  {
    title: "Connect with Us",
    links: [
      { label: "Facebook", href: "https://facebook.com" },
      { label: "Twitter", href: "https://twitter.com" },
      { label: "Instagram", href: "https://instagram.com" },
    ],
  },
  {
    title: "Let Us Help You",
    links: [
      { label: "Your Account", href: "/account" },
      { label: "Returns Centre", href: "/returns" },
      { label: "100% Purchase Protection", href: "/protection" },
      { label: "Help", href: "/help" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#232f3e] text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {footerLinks.map((section) => (
          <div key={section.title}>
            <h3 className="font-bold mb-3 text-lg">{section.title}</h3>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:underline text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="bg-[#131a22] text-center py-4 text-xs text-gray-300">
        &copy; {new Date().getFullYear()} ai-amazona. All rights reserved. Not affiliated with Amazon.com.
      </div>
    </footer>
  );
} 
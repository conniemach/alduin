import { Logo } from "@alduin/design-system";

const links = ["Products", "Operations", "Contact Us"];

export function Footer() {
  return (
    <footer className="flex flex-col gap-20 px-[70px] pb-10 pt-20">
      <nav className="flex gap-[27px]">
        {links.map((link) => (
          <a
            key={link}
            href="#"
            className="font-sans text-[14px] font-bold leading-[19.6px] tracking-[-0.35px] text-neutral-100"
          >
            {link}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-10">
        <Logo className="h-[70px] w-auto" />
        <div className="flex items-center gap-4">
          <span className="font-sans text-[12px] leading-[16.8px] text-neutral-100">
            © Alduin
          </span>
          <span className="font-sans text-[12px] leading-[16.8px] text-neutral-100">
            2026
          </span>
        </div>
        <span className="font-sans text-[12px] leading-[16.8px] text-neutral-100">
          All Rights Reserved
        </span>
      </div>
    </footer>
  );
}

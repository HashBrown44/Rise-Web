import { Globe, Mail, MessageCircle } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/data/site";
import { SERVICES } from "@/lib/data/services";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-surface/40 px-4 pb-10 pt-16 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-5">
          <div className="flex flex-col gap-4 sm:col-span-2">
            <a href="#top" className="flex w-fit items-center gap-2 font-[family-name:var(--font-heading)] text-xl font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-sm font-bold text-background">
                R
              </span>
              {SITE.name}
            </a>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              We design and build high-converting websites for local businesses ready to grow. Premium design, real ownership, no surprises.
            </p>
            <div className="flex gap-3 pt-2">
              {[
                { icon: Mail, label: "Email us" },
                { icon: MessageCircle, label: "Message us" },
                { icon: Globe, label: "Visit our site" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  data-cursor-hover
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Services</h4>
            {SERVICES.map((service) => (
              <a key={service.title} href="#services" className="text-sm text-muted transition-colors hover:text-primary">
                {service.title}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Navigate</h4>
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-muted transition-colors hover:text-primary">
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Contact</h4>
            <a href={`mailto:${SITE.email}`} className="text-sm text-muted transition-colors hover:text-primary">
              {SITE.email}
            </a>
            <a href={`tel:${SITE.phone}`} className="text-sm text-muted transition-colors hover:text-primary">
              {SITE.phone}
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-muted sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-primary">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

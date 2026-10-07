import { CONTACT_EMAIL, mailto } from "../../config/site";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 sm:px-6 py-8 text-sm text-muted sm:flex-row sm:items-center">
        <Logo />
        <p>
          Questions or higher limits:{" "}
          <a href={mailto("RivalFree")} className="font-semibold text-signal-dark underline underline-offset-2">{CONTACT_EMAIL}</a>
        </p>
        <p>© {new Date().getFullYear()} RivalFree</p>
      </div>
    </footer>
  );
}

import { CONTACT_EMAIL, mailto } from "../../config/site";

// Explains a plan limit and how to raise it.
export default function LimitNotice({ children, subject = "Increase my RivalFree limits" }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4 text-sm">
      {children && <p>{children}</p>}
      <p className={children ? "mt-1 text-muted" : ""}>
        Need higher limits? Email{" "}
        <a href={mailto(subject)} className="font-semibold text-signal-dark underline underline-offset-2">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </div>
  );
}

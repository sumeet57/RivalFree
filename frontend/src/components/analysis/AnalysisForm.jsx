import { useState } from "react";
import Button from "../ui/Button";
import Field from "../ui/Field";

// Generic name/about(/link) form. Used for new projects and new features.
export default function AnalysisForm({ submitLabel, withLink = false, loading, onSubmit, placeholders = {} }) {
  const [form, setForm] = useState({ name: "", about: "", link: "" });
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { link, ...rest } = form;
    onSubmit(withLink ? form : rest);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Name" value={form.name} onChange={set("name")} placeholder={placeholders.name} required />
      <Field label="What does it do?" multiline value={form.about} onChange={set("about")} placeholder={placeholders.about} required />
      {withLink && <Field label="Website (optional)" type="url" value={form.link} onChange={set("link")} placeholder="https://" />}
      <Button type="submit" loading={loading} className="w-full sm:w-auto">{submitLabel}</Button>
    </form>
  );
}

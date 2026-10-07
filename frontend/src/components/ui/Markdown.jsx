import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Maps each markdown element to a Tailwind-styled one (no typography plugin needed).
const el = (Tag, className) =>
  function Element({ node, ...props }) {
    return <Tag className={className} {...props} />;
  };

const components = {
  p: el("p", "my-2 first:mt-0 last:mb-0"),
  h1: el("h4", "mt-4 mb-2 text-base font-bold first:mt-0"),
  h2: el("h4", "mt-4 mb-2 text-base font-bold first:mt-0"),
  h3: el("h5", "mt-3 mb-1 text-sm font-bold first:mt-0"),
  h4: el("h5", "mt-3 mb-1 text-sm font-bold first:mt-0"),
  ul: el("ul", "my-2 list-disc space-y-1 pl-5"),
  ol: el("ol", "my-2 list-decimal space-y-1 pl-5"),
  li: el("li", ""),
  strong: el("strong", "font-semibold"),
  blockquote: el("blockquote", "my-2 border-l-2 border-current/30 pl-3 opacity-80"),
  hr: el("hr", "my-3 border-current/20"),
  pre: el("pre", "my-2 overflow-x-auto rounded-md bg-black/30 p-3 text-xs [&_code]:bg-transparent [&_code]:p-0"),
  code: el("code", "rounded bg-black/20 px-1 py-0.5 font-mono text-[0.85em]"),
  th: el("th", "border border-current/20 px-2 py-1 text-left font-semibold"),
  td: el("td", "border border-current/20 px-2 py-1"),
  table: ({ node, ...props }) => (
    <div className="my-2 overflow-x-auto">
      <table className="text-xs" {...props} />
    </div>
  ),
  a: ({ node, ...props }) => (
    <a target="_blank" rel="noreferrer" className="underline underline-offset-2" {...props} />
  ),
};

export default function Markdown({ children, className = "" }) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}

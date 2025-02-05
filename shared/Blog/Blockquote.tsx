import { Button } from "src/shared/Button";

type BlockquoteProps = {
  text: React.ReactNode | string;
  attribution: {
    name: string;
    title: string;
    company?: string;
  };
  avatar?: string;
  logo?: string;
};

export default function Blockquote({
  text,
  attribution,
  avatar,
  logo,
}: BlockquoteProps) {
  return (
    <figure className="not-prose pl-8 pr-10 py-6 rounded-lg border border-indigo-300/20">
      <blockquote className="text-lg">&ldquo;{text}&rdquo;</blockquote>
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
        {!!avatar && (
          <img
            className="rounded-full h-10 w-10"
            src={avatar}
            alt={`Image of ${attribution.name}`}
          />
        )}
        <figcaption>
          <span className="text-white font-semibold">{attribution.name}</span> -{" "}
          {attribution.title}
          {attribution.company && `, ${attribution.company}`}
        </figcaption>
        {!!logo && (
          <div className="flex grow sm:justify-end">
            <img
              className="h-10 max-w-36 self-end"
              src={logo}
              alt={
                attribution.company
                  ? `Logo of ${attribution.company}`
                  : "Company logo"
              }
            />
          </div>
        )}
      </div>
    </figure>
  );
}

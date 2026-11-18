export function StepHead({ n, verb, title, id }: { n: number; verb: string; title: string; id?: string }) {
  return (
    <>
      <p className="annot text-moss">
        {n} of 5. {verb}
      </p>
      <h3 id={id} className="h2 mt-4 text-[clamp(1.9rem,3.4vw,3rem)] text-bone">
        {title}
      </h3>
    </>
  );
}

import { Container } from "@/components/layout/container";

function PlaceholderPage({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="py-16 sm:py-24">
      <Container className="flex flex-col items-start gap-3 text-left">
        <span className="text-sm font-medium tracking-wide text-primary uppercase">
          {eyebrow}
        </span>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      </Container>
    </section>
  );
}

export { PlaceholderPage };

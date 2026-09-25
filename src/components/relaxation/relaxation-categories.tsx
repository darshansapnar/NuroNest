import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { relaxationCategories } from "@/data/relaxation";

function RelaxationCategories() {
  return (
    <section aria-labelledby="explore-categories-heading">
      <h2
        id="explore-categories-heading"
        className="font-heading text-base font-semibold text-foreground sm:text-lg"
      >
        Explore by category
      </h2>
      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
        Choose a category to find the perfect experience for your mood.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {relaxationCategories.map((category) => (
          <Link
            key={category.slug}
            href={category.href}
            className="group relative flex aspect-[4/3.2] flex-col justify-end overflow-hidden rounded-2xl outline-none ring-1 ring-foreground/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Image
              src={category.image}
              alt={category.imageAlt}
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/0"
              aria-hidden="true"
            />

            <div className="relative flex flex-col gap-1.5 p-3.5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm">
                <category.icon className="size-3.5" aria-hidden="true" />
              </span>
              <h3 className="font-heading text-sm leading-snug font-semibold text-white">
                {category.title}
              </h3>
              <p className="hidden text-xs leading-snug text-white/80 sm:line-clamp-2 sm:block">
                {category.description}
              </p>
              <span className="mt-0.5 flex size-7 items-center justify-center rounded-full bg-white/95 text-foreground transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export { RelaxationCategories };

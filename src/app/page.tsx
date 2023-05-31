import { Button, buttonVariants } from "@/components/UI/Button";

const Page = () => {
  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-3">
        <h1 className="font-extrabold text-3xl tracking-tighter leading-tight sm:text-3xl md:text-5xl lg:text-6xl">
          Simplify Image Optimization with <br className="hidden sm:inline" />
          OptimizeX
        </h1>
        <p className="text-zinc-700 dark:text-zinc-400 max-w-[700px] text-lg sm:text-xl">
          Effortlessly bulk-generate optimized versions of your images with our
          free and open-source tool.
        </p>
      </div>
      <div className="flex gap-4">
        <Button className={buttonVariants({ size: "lg", className: "w-fit" })}>
          Upload
        </Button>
      </div>
      <div className="flex flex-col gap-4 mt-12">
        <p className=" text-sm text-zinc-400">
          All images are used solely for alt-generation and are automatically
          deleted after 24h.
        </p>
        <div className="flex items-center gap-4">
          <Button
            href="/terms"
            className={buttonVariants({ variant: "link", size: "sm" })}
          >
            Terms
          </Button>
          <Button
            href="/privacy-policy"
            className={buttonVariants({ variant: "link", size: "sm" })}
          >
            Privacy Policy
          </Button>
        </div>
      </div>
    </section>
  );
};

export const metadata = {
  title: "OptimizeX",
};

export default Page;

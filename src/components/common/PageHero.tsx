export default function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-14 text-white">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">{title}</h1>
        {subtitle && <p className="mx-auto max-w-2xl text-blue-100">{subtitle}</p>}
      </div>
    </section>
  );
}

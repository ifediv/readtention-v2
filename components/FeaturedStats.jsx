'use client';

export default function FeaturedStats() {
  const stats = [
    { icon: '🎯', label: 'Curated for you' },
    { icon: '🖥️', label: '1,234 readers today' },
    { icon: '📚', label: '542 books logged' },
    { icon: '🧠', label: '9,876 insights retained' }
  ];

  return (
    <section className="bg-[#f9f9f9] py-8 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center justify-center"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <p className="text-sm font-medium text-gray-700">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

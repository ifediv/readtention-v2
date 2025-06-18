'use client';

export default function MindMapCards() {
  const cards = [
    {
      title: 'Atomic Habits',
      description: 'Tiny changes, remarkable results.',
      tags: ['📘 Productivity', '🧠 Popular']
    },
    {
      title: 'Deep Work',
      description: 'Guard your time. Focus deeply.',
      tags: ['🖥️ Focus', '🔥 High Retention']
    },
    {
      title: 'The War of Art',
      description: 'Beat resistance. Create daily.',
      tags: ['🎨 Creative Flow', '📚 Reader Favorite']
    }
  ];

  return (
    <section className="px-6 py-12 bg-white">
      <h2 className="text-xl font-semibold mb-6 text-[#1d2233]">Featured Mind Maps</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => alert(`Open: ${card.title}`)}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{card.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {card.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-gray-100 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


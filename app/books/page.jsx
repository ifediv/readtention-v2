'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MyBooksPage() {
  const [books, setBooks] = useState([
    { title: 'Atomic Habits', author: 'James Clear', ideas: 15 },
    { title: 'Deep Work', author: 'Cal Newport', ideas: 10 },
    { title: 'The War of Art', author: 'Steven Pressfield', ideas: 8 }
  ]);

  const router = useRouter();

  const addBook = () => {
    const title = prompt('Enter book title:');
    const author = prompt('Enter author name:');
    const ideas = prompt('How many ideas saved?');
    if (title && author && ideas) {
      setBooks([...books, { title, author, ideas: parseInt(ideas) }]);
    }
  };

  const deleteBook = (index) => {
    const updatedBooks = [...books];
    updatedBooks.splice(index, 1);
    setBooks(updatedBooks);
  };

  return (
    <div className="py-12 px-4 bg-white text-center">
      <h2 className="font-playfair text-2xl text-[#1d2233] mb-6">Your Bookshelf</h2>
      <div className="flex flex-col gap-8 max-w-[700px] mx-auto">
        {books.map((book, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-lg flex justify-between items-center gap-4 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-[60px] h-[80px] bg-gray-100 flex items-center justify-center rounded-md text-3xl">
                📘
              </div>
              <div>
                <div className="font-playfair text-lg font-semibold">{book.title}</div>
                <div className="text-sm text-gray-500">by {book.author}</div>
                <div className="text-sm mt-1">💡 {book.ideas} ideas saved</div>
                <button
                  onClick={() => router.push(`/books/${index}`)}
                  className="text-sm mt-2 inline-block px-3 py-1 bg-[#e5ecfb] text-[#2349b4] rounded-full"
                >
                  View Map
                </button>
              </div>
            </div>
            <button
              onClick={() => deleteBook(index)}
              className="text-lg text-gray-400 hover:text-red-500 bg-transparent border-none rounded-full p-2 shadow-md"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addBook}
        className="mt-8 px-5 py-2 bg-[#e5ecfb] text-[#2349b4] border-none rounded-full text-sm cursor-pointer"
      >
        + Add Book
      </button>
    </div>
  );
}

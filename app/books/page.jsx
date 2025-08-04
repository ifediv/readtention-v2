'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';

export default function MyBooksPage() {
  const [books, setBooks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase.from('books').select('*');
      if (!error) setBooks(data);
    };
    fetchBooks();
  }, []);

  const addBook = async () => {
    const title = prompt('Enter book title:');
    const author = prompt('Enter author name:');
    
    if (title && author) {
    const { data, error } = await supabase.from('books').insert([
      {
        title,
        author,
      }
    ]).select();

      if (error) {
        console.error('❌ Error inserting book:', error.message || error);
      } else {
        console.log('✅ Book inserted:', data);
        setBooks(prev => [...prev, data[0]]);
      }
    }
  };

  const deleteBook = async (id) => {
    const { error } = await supabase.from('books').delete().eq('id', id);
    if (!error) {
      setBooks(prev => prev.filter(book => book.id !== id));
    }
  };

  return (
    <div className="py-12 px-4 bg-white text-center">
      <h2 className="font-playfair text-2xl text-[#1d2233] mb-6">Your Bookshelf</h2>
      <div className="flex flex-col gap-8 max-w-[700px] mx-auto">
        {books.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Your bookshelf is empty</h3>
            <p className="text-gray-500 mb-6">Start building your knowledge by adding your first book!</p>
            <button
              onClick={addBook}
              className="px-6 py-3 bg-[#2349b4] text-white border-none rounded-full text-base cursor-pointer hover:bg-[#1a3798] transition-colors"
            >
              📖 Add Your First Book
            </button>
          </div>
        ) : (
          books.map((book, index) => (
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
                  onClick={() => router.push(`/bookshelf-v2/${book.id}`)}
                  className="text-sm mt-2 inline-block px-3 py-1 bg-[#e5ecfb] text-[#2349b4] rounded-full"
                >
                  View Map
                </button>
              </div>
            </div>
            <button
              onClick={() => deleteBook(book.id)}
              className="text-lg text-gray-400 hover:text-red-500 bg-transparent border-none rounded-full p-2 shadow-md"
            >
              🗑️
            </button>
          </div>
          ))
        )}
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

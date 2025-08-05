'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/utils/supabaseClient';
import { openLibrary } from '@/utils/openLibraryClient';

// Search and loading components
const SearchBar = ({ onSearch, isSearching }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      onSubmit={handleSubmit}
      className="relative max-w-2xl mx-auto mb-8"
    >
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books by title, author, or ISBN..."
          className="w-full px-6 py-4 text-lg bg-white rounded-2xl shadow-lg border-2 border-gray-100 focus:border-[#2349b4] focus:outline-none transition-all duration-300 pl-14"
        />
        <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {isSearching && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#2349b4]"></div>
          </div>
        )}
      </div>
    </motion.form>
  );
};

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="flex flex-wrap justify-center gap-3 mb-8"
    >
      {categories.map((category) => (
        <motion.button
          key={category}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            selectedCategory === category
              ? 'bg-[#2349b4] text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {category}
        </motion.button>
      ))}
    </motion.div>
  );
};

const BookCard = ({ book, onSelect, isSelected }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <motion.div
      layout
      key={book.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-300 ${
        isSelected ? 'ring-2 ring-[#2349b4] ring-offset-2' : ''
      }`}
      onClick={() => onSelect(book)}
    >
      <div className="flex flex-col items-center text-center">
        {/* Book Cover */}
        <motion.div
          className="relative w-32 h-48 mb-4 rounded-lg overflow-hidden shadow-md"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {book.coverUrl && !imageError ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
                  <div className="text-gray-400 text-4xl">📖</div>
                </div>
              )}
              <Image
                src={book.coverUrl}
                alt={book.title}
                fill
                className="object-cover"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#2349b4] to-[#1a3798] flex items-center justify-center text-white text-4xl">
              📚
            </div>
          )}
          
          {/* Rating Badge */}
          {book.ratings?.average && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
              ⭐ {book.ratings.average.toFixed(1)}
            </div>
          )}
        </motion.div>

        {/* Book Info */}
        <h3 className="font-playfair text-lg font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
          {book.title}
        </h3>
        <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
        
        {/* Metadata */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {book.publishYear && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {book.publishYear}
            </span>
          )}
          {book.pageCount && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {book.pageCount} pages
            </span>
          )}
        </div>

        {/* Subjects/Tags */}
        {book.subjects?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 mb-4">
            {book.subjects.slice(0, 3).map((subject, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
              >
                {subject}
              </span>
            ))}
          </div>
        )}

        {/* Select Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            isSelected
              ? 'bg-green-500 text-white'
              : 'bg-[#2349b4] text-white hover:bg-[#1a3798]'
          }`}
        >
          {isSelected ? '✓ Selected' : 'Select Book'}
        </motion.button>
      </div>
    </motion.div>
  );
};

const MyBookCard = ({ book, onDelete }) => {
  const router = useRouter();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="w-16 h-20 bg-gradient-to-br from-[#2349b4] to-[#1a3798] rounded-lg flex items-center justify-center text-white text-2xl shadow-md">
          📖
        </div>
        <div className="flex-1">
          <h3 className="font-playfair text-lg font-bold text-gray-800 mb-1">{book.title}</h3>
          <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">💡 {book.ideas || 0} ideas saved</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/bookshelf-v2/${book.id}`)}
              className="px-3 py-1 bg-[#e5ecfb] text-[#2349b4] rounded-full text-xs font-medium hover:bg-[#d1dbf7] transition-colors"
            >
              View Map
            </motion.button>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, color: '#ef4444' }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(book.id)}
          className="text-gray-400 hover:text-red-500 transition-colors p-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default function MyBooksPage() {
  const [books, setBooks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState(new Set());
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Fiction', 'Non-fiction', 'Science', 'History', 'Biography', 'Technology', 'Business', 'Health'];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const { data, error } = await supabase.from('books').select('*');
    if (!error) setBooks(data || []);
  };

  const handleSearch = useCallback(async (query) => {
    setIsSearching(true);
    try {
      let results;
      if (selectedCategory === 'All') {
        results = await openLibrary.searchBooks(query, 24);
      } else {
        results = await openLibrary.searchBooks(`${query} subject:"${selectedCategory.toLowerCase()}"`, 24);
      }
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [selectedCategory]);

  const handleCategoryChange = async (category) => {
    setSelectedCategory(category);
    if (category !== 'All') {
      setIsSearching(true);
      try {
        const results = await openLibrary.getTrendingBooks(category.toLowerCase(), 24);
        setSearchResults(results);
      } catch (error) {
        console.error('Category search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const toggleBookSelection = (book) => {
    const newSelected = new Set(selectedBooks);
    const bookId = book.id;
    
    if (newSelected.has(bookId)) {
      newSelected.delete(bookId);
    } else {
      newSelected.add(bookId);
    }
    setSelectedBooks(newSelected);
  };

  const addSelectedBooks = async () => {
    if (selectedBooks.size === 0) return;

    const booksToAdd = searchResults.filter(book => selectedBooks.has(book.id));
    
    for (const book of booksToAdd) {
      try {
        const { data, error } = await supabase.from('books').insert([{
          title: book.title,
          author: book.author,
        }]).select();

        if (error) {
          console.error('Error inserting book:', error);
        } else {
          console.log('Book inserted:', data);
        }
      } catch (error) {
        console.error('Error adding book:', error);
      }
    }

    // Refresh books list
    await fetchBooks();
    setSelectedBooks(new Set());
    setShowSearch(false);
    setSearchResults([]);
  };

  const deleteBook = async (id) => {
    const { error } = await supabase.from('books').delete().eq('id', id);
    if (!error) {
      setBooks(prev => prev.filter(book => book.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-16 pb-8 text-center"
      >
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Your Learning Library
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 px-4">
          Discover and collect books that will expand your knowledge and fuel your intellectual journey
        </p>
        
        {!showSearch && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSearch(true)}
            className="px-8 py-4 bg-[#2349b4] text-white rounded-2xl text-lg font-medium shadow-lg hover:bg-[#1a3798] transition-all duration-300"
          >
            🔍 Discover New Books
          </motion.button>
        )}
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Search Interface */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <SearchBar onSearch={handleSearch} isSearching={isSearching} />
              <CategoryFilter 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
              
              {selectedBooks.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-6"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addSelectedBooks}
                    className="px-8 py-3 bg-green-500 text-white rounded-2xl font-medium shadow-lg hover:bg-green-600 transition-all duration-300"
                  >
                    Add {selectedBooks.size} Selected Book{selectedBooks.size !== 1 ? 's' : ''} to Library
                  </motion.button>
                </motion.div>
              )}

              {/* Search Results */}
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Discover Books</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {searchResults.map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        onSelect={toggleBookSelection}
                        isSelected={selectedBooks.has(book.id)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mt-8"
              >
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearchResults([]);
                    setSelectedBooks(new Set());
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ← Back to Your Library
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* My Books */}
        {!showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {books.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-20"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="text-8xl mb-6"
                >
                  📚
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-600 mb-4">Your library awaits</h3>
                <p className="text-lg text-gray-500 mb-8 max-w-md mx-auto">
                  Start your learning journey by discovering and adding books that inspire your curiosity
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSearch(true)}
                  className="px-8 py-4 bg-[#2349b4] text-white rounded-2xl text-lg font-medium shadow-lg hover:bg-[#1a3798] transition-all duration-300"
                >
                  🌟 Discover Your First Book
                </motion.button>
              </motion.div>
            ) : (
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Your Personal Library</h2>
                <div className="grid gap-6 max-w-4xl mx-auto">
                  <AnimatePresence>
                    {books.map((book) => (
                      <MyBookCard
                        key={book.id}
                        book={book}
                        onDelete={deleteBook}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

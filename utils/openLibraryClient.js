/**
 * Open Library API Client for Readtention
 * Provides book search, metadata, and cover image functionality
 */

const OPEN_LIBRARY_API_BASE = 'https://openlibrary.org';
const OPEN_LIBRARY_COVERS_BASE = 'https://covers.openlibrary.org/b';

export class OpenLibraryClient {
  /**
   * Search for books by title, author, or ISBN
   * @param {string} query - Search query
   * @param {number} limit - Number of results to return (default: 20)
   * @returns {Promise<Array>} Array of book objects
   */
  async searchBooks(query, limit = 20) {
    try {
      const url = `${OPEN_LIBRARY_API_BASE}/search.json?q=${encodeURIComponent(query)}&limit=${limit}`;
      const response = await fetch(url);
      const data = await response.json();
      
      return data.docs.map(book => ({
        id: book.key,
        title: book.title,
        author: book.author_name?.[0] || 'Unknown Author',
        authors: book.author_name || [],
        publishYear: book.first_publish_year,
        isbn: book.isbn?.[0],
        coverEditionKey: book.cover_edition_key,
        coverUrl: book.cover_edition_key 
          ? `${OPEN_LIBRARY_COVERS_BASE}/olid/${book.cover_edition_key}-M.jpg`
          : null,
        coverLarge: book.cover_edition_key 
          ? `${OPEN_LIBRARY_COVERS_BASE}/olid/${book.cover_edition_key}-L.jpg`
          : null,
        pageCount: book.number_of_pages_median,
        subjects: book.subject?.slice(0, 5) || [], // Limit to top 5 subjects
        description: book.first_sentence?.[0] || null,
        ratings: {
          average: book.ratings_average,
          count: book.ratings_count
        }
      }));
    } catch (error) {
      console.error('Error searching books:', error);
      return [];
    }
  }

  /**
   * Get detailed information about a specific book
   * @param {string} bookKey - Open Library book key (e.g., "/works/OL12345W")
   * @returns {Promise<Object>} Detailed book information
   */
  async getBookDetails(bookKey) {
    try {
      const url = `${OPEN_LIBRARY_API_BASE}${bookKey}.json`;
      const response = await fetch(url);
      const data = await response.json();
      
      return {
        title: data.title,
        description: typeof data.description === 'string' 
          ? data.description 
          : data.description?.value || null,
        subjects: data.subjects || [],
        covers: data.covers?.map(coverId => ({
          small: `${OPEN_LIBRARY_COVERS_BASE}/id/${coverId}-S.jpg`,
          medium: `${OPEN_LIBRARY_COVERS_BASE}/id/${coverId}-M.jpg`,
          large: `${OPEN_LIBRARY_COVERS_BASE}/id/${coverId}-L.jpg`
        })) || [],
        created: data.created,
        lastModified: data.last_modified
      };
    } catch (error) {
      console.error('Error fetching book details:', error);
      return null;
    }
  }

  /**
   * Get book information by ISBN
   * @param {string} isbn - Book ISBN (10 or 13 digits)
   * @returns {Promise<Object>} Book information
   */
  async getBookByISBN(isbn) {
    try {
      const url = `${OPEN_LIBRARY_API_BASE}/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
      const response = await fetch(url);
      const data = await response.json();
      
      const bookData = data[`ISBN:${isbn}`];
      if (!bookData) return null;
      
      return {
        title: bookData.title,
        authors: bookData.authors?.map(author => author.name) || [],
        publishDate: bookData.publish_date,
        publishers: bookData.publishers?.map(pub => pub.name) || [],
        pageCount: bookData.number_of_pages,
        coverUrl: bookData.cover 
          ? `${OPEN_LIBRARY_COVERS_BASE}/isbn/${isbn}-M.jpg`
          : null,
        coverLarge: bookData.cover 
          ? `${OPEN_LIBRARY_COVERS_BASE}/isbn/${isbn}-L.jpg`
          : null,
        subjects: bookData.subjects?.map(subject => subject.name) || [],
        description: bookData.excerpts?.[0]?.text || null,
        url: bookData.url
      };
    } catch (error) {
      console.error('Error fetching book by ISBN:', error);
      return null;
    }
  }

  /**
   * Get cover image URL for a book
   * @param {string} identifier - ISBN, OCLC, LCCN, OLID, or OpenLibrary ID
   * @param {string} type - Type of identifier ('isbn', 'oclc', 'lccn', 'olid', 'id')
   * @param {string} size - Cover size ('S', 'M', 'L')
   * @returns {string} Cover image URL
   */
  getCoverUrl(identifier, type = 'isbn', size = 'M') {
    return `${OPEN_LIBRARY_COVERS_BASE}/${type}/${identifier}-${size}.jpg`;
  }

  /**
   * Search for books by author
   * @param {string} authorName - Author name
   * @param {number} limit - Number of results
   * @returns {Promise<Array>} Array of books by the author
   */
  async getBooksByAuthor(authorName, limit = 20) {
    return this.searchBooks(`author:"${authorName}"`, limit);
  }

  /**
   * Get trending/popular books
   * @param {string} subject - Subject/genre (optional)
   * @param {number} limit - Number of results
   * @returns {Promise<Array>} Array of trending books
   */
  async getTrendingBooks(subject = '', limit = 20) {
    const query = subject 
      ? `subject:"${subject}" AND ratings_count:>100`
      : 'ratings_count:>1000';
    
    return this.searchBooks(query, limit);
  }
}

// Export singleton instance
export const openLibrary = new OpenLibraryClient();
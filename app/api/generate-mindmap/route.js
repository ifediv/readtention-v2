import { supabase } from '@/utils/supabaseClient';

export async function POST(req) {
  const { book_id } = await req.json();

  if (!book_id) {
    return new Response(JSON.stringify({ error: 'Missing book_id' }), { status: 400 });
  }

  try {
    // Get book information
    const { data: bookData, error: bookError } = await supabase
      .from('books')
      .select('title, author')
      .eq('id', book_id)
      .single();

    if (bookError || !bookData) {
      console.error('Failed to fetch book:', bookError);
      return new Response(JSON.stringify({ error: 'Book not found' }), { status: 404 });
    }

    // Generate mindmap directly using the book information

    // Generate mindmap using OpenAI with user's specific prompt structure
    const mindmapPrompt = `Create a mind map of "${bookData.title}" by ${bookData.author}. List topics as central ideas, main branches, and sub-branches.

Please format the response as markdown for use with Markmap, following this structure:

# ${bookData.title}

## Main Themes
- [Primary theme 1]
  - [Supporting concept]
  - [Key detail]
- [Primary theme 2]
  - [Supporting concept]
  - [Key detail]

## Key Concepts
- [Important concept 1]
  - [Sub-point]
  - [Application]
- [Important concept 2]
  - [Sub-point]
  - [Application]

## Practical Applications
- [How to apply the ideas]
  - [Specific action]
  - [Expected outcome]

Make it comprehensive yet clear, focusing on the book's most important insights and practical applications.`;

    // Check if OpenAI API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error('Missing OpenAI API key');
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), { status: 500 });
    }

    const mindmapRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: mindmapPrompt }],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!mindmapRes.ok) {
      const errorData = await mindmapRes.json();
      console.error('OpenAI API error:', errorData);
      return new Response(JSON.stringify({ 
        error: `OpenAI API error: ${errorData.error?.message || 'Unknown error'}` 
      }), { status: 500 });
    }

    const mindmapData = await mindmapRes.json();
    const mindmapMarkdown = mindmapData.choices?.[0]?.message?.content || '';

    if (!mindmapMarkdown) {
      console.error('Empty response from OpenAI:', mindmapData);
      return new Response(JSON.stringify({ error: 'Empty response from OpenAI' }), { status: 500 });
    }

    // Try to save the mindmap to Supabase (optional - don't fail if this doesn't work)
    try {
      const { error: mindmapInsertError } = await supabase.from('mindmaps').insert([
        {
          book_id,
          content: mindmapMarkdown,
          created_at: new Date().toISOString()
        }
      ]);

      if (mindmapInsertError) {
        console.warn('Failed to save mindmap to database (continuing anyway):', mindmapInsertError);
      } else {
        console.log('Successfully saved mindmap to database');
      }
    } catch (saveError) {
      console.warn('Error saving mindmap to database (continuing anyway):', saveError);
    }

    return new Response(JSON.stringify({ 
      mindmap: mindmapMarkdown,
      success: true 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error generating mindmap:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}


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

    // Get all messages for this book
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('content, role')
      .eq('book_id', book_id)
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error('Failed to fetch messages:', messagesError);
      return new Response(JSON.stringify({ error: 'Failed to fetch messages' }), { status: 500 });
    }

    // Get all insights for this book
    const { data: insights, error: insightsError } = await supabase
      .from('insights')
      .select('themes, quotes, takeaways')
      .eq('book_id', book_id);

    if (insightsError) {
      console.error('Failed to fetch insights:', insightsError);
      return new Response(JSON.stringify({ error: 'Failed to fetch insights' }), { status: 500 });
    }

    // Combine all user messages and insights
    const userMessages = messages.filter(msg => msg.role === 'user').map(msg => msg.content);
    const allThemes = insights.flatMap(insight => insight.themes || []);
    const allQuotes = insights.flatMap(insight => insight.quotes || []);
    const allTakeaways = insights.flatMap(insight => insight.takeaways || []);

    // Generate mindmap using OpenAI
    const mindmapPrompt = `
Create a comprehensive mind map for the book "${bookData.title}" by ${bookData.author} based on the user's conversation and insights.

User Messages:
${userMessages.join('\n')}

Extracted Themes:
${allThemes.join('\n')}

Extracted Quotes:
${allQuotes.join('\n')}

Extracted Takeaways:
${allTakeaways.join('\n')}

Generate a mind map in Markmap markdown format. The structure should be:

# ${bookData.title}

## Central Theme
- Main idea or thesis

## Key Concepts
- Concept 1
  - Sub-concept 1.1
  - Sub-concept 1.2
- Concept 2
  - Sub-concept 2.1
  - Sub-concept 2.2

## Important Quotes
- "Quote 1"
- "Quote 2"

## Personal Takeaways
- Takeaway 1
- Takeaway 2

## Applications
- How to apply concept 1
- How to apply concept 2

Make it comprehensive but organized. Focus on the most important insights from the user's conversation.
`;

    const mindmapRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4-1106-preview',
        messages: [{ role: 'user', content: mindmapPrompt }]
      })
    });

    const mindmapData = await mindmapRes.json();
    const mindmapMarkdown = mindmapData.choices?.[0]?.message?.content || '';

    if (!mindmapMarkdown) {
      return new Response(JSON.stringify({ error: 'Failed to generate mindmap' }), { status: 500 });
    }

    // Save the mindmap to Supabase
    const { error: mindmapInsertError } = await supabase.from('mindmaps').insert([
      {
        book_id,
        content: mindmapMarkdown,
        created_at: new Date().toISOString()
      }
    ]);

    if (mindmapInsertError) {
      console.error('Failed to save mindmap:', mindmapInsertError);
      return new Response(JSON.stringify({ error: 'Failed to save mindmap' }), { status: 500 });
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

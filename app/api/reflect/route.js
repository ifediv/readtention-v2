import { supabase } from '@/utils/supabaseClient';

export async function POST(req) {
  const { message, book_id } = await req.json();

  if (!message || !book_id) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  try {
    // Get book information for context
    const { data: bookData, error: bookError } = await supabase
      .from('books')
      .select('title, author')
      .eq('id', book_id)
      .single();

    if (bookError || !bookData) {
      console.error('Failed to fetch book:', bookError);
      return new Response(JSON.stringify({ error: 'Book not found' }), { status: 404 });
    }

    // Create Socratic reflection prompt
    const reflectionPrompt = `You are a Socratic assistant helping a user reflect on their reading of "${bookData.title}" by ${bookData.author}.

The user just shared: "${message}"

Respond as a thoughtful Socratic teacher would:
1. Acknowledge their insight
2. Ask a follow-up question that deepens their thinking
3. Help them connect ideas to the book's main themes
4. Encourage them to provide specific examples or elaborate further

Keep your response concise (2-3 sentences max) and conversational. Focus on guiding their reflection rather than providing answers.`;

    // Call OpenAI for Socratic reflection
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a Socratic assistant focused on helping users reflect deeply on their reading.' },
          { role: 'user', content: reflectionPrompt }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    const aiData = await openaiResponse.json();
    const aiResponse = aiData.choices?.[0]?.message?.content || 'I appreciate you sharing that insight. Can you tell me more about how this connects to the main themes of the book?';

    return new Response(JSON.stringify({ 
      ai_response: aiResponse,
      success: true 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in reflect API:', error);
    return new Response(JSON.stringify({ 
      ai_response: "That's an interesting perspective. Can you elaborate on that thought?",
      error: 'Fallback response due to API error'
    }), { status: 200 });
  }
}

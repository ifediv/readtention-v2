route.js
import { supabase } from '@/utils/supabaseClient';

export async function POST(req) {
  const { message, book_id, message_id } = await req.json();

  if (!message || !book_id || !message_id) {
    return new Response(JSON.stringify({ error: 'Missing data' }), { status: 400 });
  }

  // Step 1: Extract insights
  const insightPrompt = `
Extract any themes, quotes, or takeaways from this message. Respond with a JSON object like:
{
  "themes": [...],
  "quotes": [...],
  "takeaways": [...]
}

Message:
"${message}"
  `;

  const insightRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4-1106-preview',
      messages: [{ role: 'user', content: insightPrompt }]
    })
  });

  const insightData = await insightRes.json();
  console.log('Insight API response:', JSON.stringify(insightData, null, 2));
  
  let insights = {};

  try {
    const rawContent = insightData.choices[0].message.content;
    const cleanedContent = rawContent.replace(/```json|```/g, '').trim();
    insights = JSON.parse(cleanedContent);
  } catch (e) {
    console.error('Failed to parse AI insights JSON:', insightData);
    return new Response(JSON.stringify({ error: 'Failed to parse insights' }), { status: 500 });
  }

  // Step 2: Store in Supabase
  const { error: insightInsertError } = await supabase.from('insights').insert([
    {
      book_id,
      message_id,
      themes: insights.themes || [],
      quotes: insights.quotes || [],
      takeaways: insights.takeaways || []
    }
  ]);

  if (insightInsertError) {
  console.error('Failed to insert insights:', insightInsertError);
  return new Response(JSON.stringify({ error: 'Failed to insert insights' }), { status: 500 });
    }

  // Get book title from Supabase
  const { data: bookData, error: bookError } = await supabase
    .from('books')
    .select('title')
    .eq('id', book_id)
    .single();

  if (bookError || !bookData) {
    console.error('Failed to fetch book title:', bookError);
    return new Response(JSON.stringify({ error: 'Book not found' }), { status: 404 });
  }

  const bookTitle = bookData.title;


  // Step 3: Ask follow-up
  const followupPrompt = `
  You are a Socratic AI assistant helping a user reflect on what they’ve learned from a book they’re reading.

  Book: "${bookTitle}"
  User message: "${message}"
  Extracted insights: ${JSON.stringify(insights)}

  Craft a thoughtful follow-up question that either:
  - encourages deeper self-reflection
  - ties the book’s idea to the user’s life
  - or prompts application of the concept

  Only respond with a **single, clear, natural-sounding question** — no preamble.
  `;

  const followupRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4-1106-preview',
      messages: [{ role: 'user', content: followupPrompt }]
    })
  });

  const followupData = await followupRes.json();
  const aiResponse = followupData.choices?.[0]?.message?.content || 'Interesting. Tell me more.';

  // Step 4: Save AI response
  const { error: aiInsertError } = await supabase.from('messages').insert([
    {
      book_id,
      role: 'ai',
      content: aiResponse
    }
  ]);

  if (aiInsertError) {
  console.error('Failed to insert AI message:', aiInsertError);
  return new Response(JSON.stringify({ error: 'Failed to insert AI response' }), { status: 500 });
    }

  // Step 5: Return to frontend
  return new Response(JSON.stringify({ ai_response: aiResponse }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
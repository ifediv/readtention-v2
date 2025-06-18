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

  // Step 3: Ask follow-up
  const followupPrompt = `
Given this message:
"${message}"

And these extracted insights:
${JSON.stringify(insights)}

What is the next best follow-up question to ask the user to deepen their reflection? Only return the question text.
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

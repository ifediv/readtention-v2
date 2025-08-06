import { supabase } from '@/utils/supabaseClient';

// Lens configuration for prompt generation
const lensPrompts = {
  analytical: {
    focus: "logical structure, cause-effect relationships, evidence-based reasoning, systematic analysis",
    sections: ["Logic & Structure", "Evidence & Analysis", "Cause-Effect Chains", "Systematic Breakdown"]
  },
  character: {
    focus: "characters, relationships, motivations, personal development, human dynamics",
    sections: ["Key Characters", "Character Development", "Relationships & Dynamics", "Motivations & Goals"]
  },
  philosophical: {
    focus: "big ideas, ethical implications, worldview concepts, deeper meaning, wisdom",
    sections: ["Core Philosophy", "Ethical Dimensions", "Big Ideas", "Universal Truths"]
  },
  creative: {
    focus: "innovation, artistic elements, creative thinking, inspiration, imaginative connections",
    sections: ["Creative Concepts", "Innovative Ideas", "Artistic Elements", "Inspiration Points"]
  },
  practical: {
    focus: "actionable insights, implementation steps, how-to guidance, real-world applications",
    sections: ["Action Steps", "Implementation Guide", "Practical Tools", "Real-World Applications"]
  },
  emotional: {
    focus: "feelings, psychological impact, emotional intelligence, personal resonance",
    sections: ["Emotional Journey", "Psychological Insights", "Personal Impact", "Feeling States"]
  },
  historical: {
    focus: "historical context, timeline, evolution of ideas, cultural background, influence over time",
    sections: ["Historical Context", "Timeline & Evolution", "Cultural Background", "Legacy & Influence"]
  },
  connective: {
    focus: "connections to other ideas, cross-references, synthesis, broader knowledge networks",
    sections: ["Connections & Links", "Cross-References", "Knowledge Networks", "Synthesis Points"]
  }
};

function generateCustomPrompt(bookData, lensData) {
  // Default prompt if no lens data provided
  if (!lensData || !lensData.selectedModes || Object.keys(lensData.selectedModes).length === 0) {
    return `Create a comprehensive mind map of "${bookData.title}" by ${bookData.author}. 

Please format the response as markdown for use with Markmap, following this structure:

# ${bookData.title}

## Main Themes
- [Primary theme 1]
  - [Supporting concept]
  - [Key detail]

## Key Concepts  
- [Important concept 1]
  - [Sub-point]
  - [Application]

## Practical Applications
- [How to apply the ideas]
  - [Specific action]
  - [Expected outcome]

Make it comprehensive yet clear, focusing on the book's most important insights.`;
  }

  // Generate customized prompt based on selected lenses
  const selectedLenses = Object.entries(lensData.selectedModes);
  const primaryLens = selectedLenses.reduce((max, current) => 
    current[1] > max[1] ? current : max
  );
  const primaryLensKey = primaryLens[0];
  const primaryLensConfig = lensPrompts[primaryLensKey];

  // Build focus areas text
  const focusAreas = selectedLenses
    .map(([key, intensity]) => {
      const weight = intensity >= 0.8 ? "strongly emphasize" : intensity >= 0.5 ? "focus on" : "touch on";
      return `${weight} ${lensPrompts[key].focus}`;
    })
    .join(', and ');

  // Build sections based on selected lenses
  const sections = selectedLenses
    .sort((a, b) => b[1] - a[1]) // Sort by intensity
    .map(([key, intensity]) => {
      const config = lensPrompts[key];
      const primarySection = config.sections[0];
      const secondarySection = intensity >= 0.7 ? config.sections[1] : null;
      return { primary: primarySection, secondary: secondarySection };
    });

  const prompt = `Create a personalized mind map of "${bookData.title}" by ${bookData.author}.

PERSONALIZATION INSTRUCTIONS:
- Primary perspective: ${primaryLensConfig.focus}
- Additional focus areas: ${focusAreas}
- Tailor the content depth and emphasis based on these selected reading perspectives
- ${lensData.preset !== 'custom' ? `This follows the "${lensData.preset}" reading style.` : 'This is a custom combination of perspectives.'}

Please format the response as markdown for use with Markmap, following this structure:

# ${bookData.title}

## ${sections[0]?.primary || 'Main Themes'}
- [Key point relevant to selected perspectives]
  - [Supporting detail focused on your lens selection]
  - [Specific insight matching your reading style]

## ${sections[1]?.primary || 'Key Insights'}
- [Important insight from your selected perspective]
  - [Sub-point emphasizing chosen focus areas]
  - [Application or connection relevant to your lenses]

${sections[0]?.secondary ? `## ${sections[0].secondary}
- [Additional perspective-specific content]
  - [Details matching your customized focus]` : ''}

${sections[1]?.secondary && sections.length > 1 ? `## ${sections[1].secondary}
- [Further exploration of selected themes]
  - [Depth matching your intensity preferences]` : ''}

## Synthesis & Applications
- [How these perspectives come together]
  - [Actionable insights from your selected viewpoint]
  - [Personal relevance based on your reading lens choice]

Make this mind map deeply relevant to the ${Object.keys(lensData.selectedModes).join(', ')} perspective${Object.keys(lensData.selectedModes).length > 1 ? 's' : ''} selected. Ensure the content emphasis matches the intensity levels chosen for each lens.`;

  return prompt;
}

export async function POST(req) {
  const { book_id, lensData } = await req.json();

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

    // Generate personalized mindmap prompt based on lens data
    const mindmapPrompt = generateCustomPrompt(bookData, lensData);

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

    // Try to save the mindmap to Supabase with lens metadata (optional - don't fail if this doesn't work)
    try {
      const mindmapData = {
        book_id,
        content: mindmapMarkdown,
        generation_prompt: mindmapPrompt,
        ai_model: 'gpt-4',
        metadata: {
          lensData: lensData,
          generatedAt: new Date().toISOString(),
          customization: lensData ? 'lens-customized' : 'default'
        },
        created_at: new Date().toISOString()
      };

      const { error: mindmapInsertError } = await supabase.from('mindmaps').insert([mindmapData]);

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


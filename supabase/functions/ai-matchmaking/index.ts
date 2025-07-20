import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventId, sponsorId, action } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get auth user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (!user) {
      throw new Error('Unauthorized');
    }

    switch (action) {
      case 'generateRecommendations':
        return await generateRecommendations(supabase, user.id);
      case 'getSingleMatch':
        return await getSingleMatch(supabase, eventId, sponsorId);
      case 'updateMatchStatus':
        return await updateMatchStatus(supabase, eventId, sponsorId, await req.json());
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error in ai-matchmaking function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateRecommendations(supabase: any, userId: string) {
  console.log('Generating recommendations for user:', userId);
  
  // Get user role
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (!userRole) {
    throw new Error('User role not found');
  }

  if (userRole.role === 'student') {
    return await generateSponsorRecommendations(supabase, userId);
  } else if (userRole.role === 'sponsor') {
    return await generateEventRecommendations(supabase, userId);
  }

  throw new Error('Invalid user role');
}

async function generateSponsorRecommendations(supabase: any, userId: string) {
  console.log('Generating sponsor recommendations for student:', userId);
  
  // Get student's events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('organizer_id', userId);

  if (!events || events.length === 0) {
    return new Response(JSON.stringify({ recommendations: [] }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Get all sponsors
  const { data: sponsors } = await supabase
    .from('sponsors')
    .select('*');

  if (!sponsors || sponsors.length === 0) {
    return new Response(JSON.stringify({ recommendations: [] }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const recommendations = [];
  
  for (const event of events) {
    for (const sponsor of sponsors) {
      // Check if recommendation already exists
      const { data: existing } = await supabase
        .from('recommendations')
        .select('id')
        .eq('event_id', event.id)
        .eq('sponsor_id', sponsor.id)
        .single();

      if (existing) continue;

      const matchData = await calculateMatchScore(event, sponsor);
      
      if (matchData.score > 60) { // Only create recommendations with score > 60%
        const { error } = await supabase
          .from('recommendations')
          .insert({
            event_id: event.id,
            sponsor_id: sponsor.id,
            match_score: matchData.score,
            reasoning: matchData.reasoning,
            factors: matchData.factors
          });

        if (!error) {
          recommendations.push({
            eventId: event.id,
            sponsorId: sponsor.id,
            score: matchData.score,
            reasoning: matchData.reasoning
          });
        }
      }
    }
  }

  console.log(`Generated ${recommendations.length} sponsor recommendations`);
  
  return new Response(JSON.stringify({ 
    recommendations,
    message: `Generated ${recommendations.length} new sponsor recommendations`
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

async function generateEventRecommendations(supabase: any, userId: string) {
  console.log('Generating event recommendations for sponsor:', userId);
  
  // Get sponsor profile
  const { data: sponsor } = await supabase
    .from('sponsors')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!sponsor) {
    throw new Error('Sponsor profile not found');
  }

  // Get all events
  const { data: events } = await supabase
    .from('events')
    .select('*');

  if (!events || events.length === 0) {
    return new Response(JSON.stringify({ recommendations: [] }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const recommendations = [];
  
  for (const event of events) {
    // Check if recommendation already exists
    const { data: existing } = await supabase
      .from('recommendations')
      .select('id')
      .eq('event_id', event.id)
      .eq('sponsor_id', sponsor.id)
      .single();

    if (existing) continue;

    const matchData = await calculateMatchScore(event, sponsor);
    
    if (matchData.score > 60) { // Only create recommendations with score > 60%
      const { error } = await supabase
        .from('recommendations')
        .insert({
          event_id: event.id,
          sponsor_id: sponsor.id,
          match_score: matchData.score,
          reasoning: matchData.reasoning,
          factors: matchData.factors
        });

      if (!error) {
        recommendations.push({
          eventId: event.id,
          sponsorId: sponsor.id,
          score: matchData.score,
          reasoning: matchData.reasoning
        });
      }
    }
  }

  console.log(`Generated ${recommendations.length} event recommendations`);
  
  return new Response(JSON.stringify({ 
    recommendations,
    message: `Generated ${recommendations.length} new event recommendations`
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

async function calculateMatchScore(event: any, sponsor: any) {
  console.log('Calculating match score for event:', event.id, 'and sponsor:', sponsor.id);
  
  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
  
  if (!GEMINI_API_KEY) {
    // Fallback scoring algorithm when API key is not available
    return calculateFallbackMatchScore(event, sponsor);
  }

  try {
    const prompt = `
    You are an AI matchmaking expert for student events and sponsors. Calculate a match score and provide reasoning.

    Event Details:
    - Title: ${event.title}
    - Category: ${event.category || 'Not specified'}
    - Description: ${event.description || 'No description'}
    - Location: ${event.location || 'Not specified'}
    - Budget Range: ${event.budget_range || 'Not specified'}
    - Audience Size: ${event.audience_size || 'Not specified'}
    - Date: ${event.event_date || 'Not specified'}

    Sponsor Details:
    - Company: ${sponsor.company_name}
    - Industry: ${sponsor.industry || 'Not specified'}
    - Budget Range: ${sponsor.budget_range || 'Not specified'}
    - Marketing Goals: ${sponsor.marketing_goals || 'Not specified'}
    - Target Demographics: ${JSON.stringify(sponsor.target_demographics || [])}

    Provide a JSON response with:
    1. A match score (0-100) based on compatibility
    2. Detailed reasoning explaining the score
    3. Key matching factors

    Consider: industry alignment, budget compatibility, audience fit, location proximity, event type relevance, and marketing goal alignment.

    Response format:
    {
      "score": 85,
      "reasoning": "High compatibility due to...",
      "factors": {
        "industry_alignment": 90,
        "budget_compatibility": 80,
        "audience_fit": 85,
        "location_proximity": 70,
        "marketing_alignment": 95
      }
    }
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const resultText = data.candidates[0].content.parts[0].text;
      // Extract JSON from the response
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        console.log('Gemini API match result:', result);
        return result;
      }
    }
    
    throw new Error('Invalid response from Gemini API');
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Fallback to simple scoring
    return calculateFallbackMatchScore(event, sponsor);
  }
}

function calculateFallbackMatchScore(event: any, sponsor: any) {
  console.log('Using fallback match scoring');
  
  let score = 50; // Base score
  const factors = {
    budget_compatibility: 50,
    category_alignment: 50,
    audience_fit: 50,
    location_proximity: 50,
    marketing_alignment: 50
  };

  // Budget compatibility
  if (event.budget_range && sponsor.budget_range) {
    if (event.budget_range === sponsor.budget_range) {
      factors.budget_compatibility = 95;
      score += 20;
    } else {
      factors.budget_compatibility = 70;
      score += 10;
    }
  }

  // Category/Industry alignment
  if (event.category && sponsor.industry) {
    const categoryKeywords = event.category.toLowerCase().split(' ');
    const industryKeywords = sponsor.industry.toLowerCase().split(' ');
    const hasMatch = categoryKeywords.some(keyword => 
      industryKeywords.some(ind => ind.includes(keyword) || keyword.includes(ind))
    );
    if (hasMatch) {
      factors.category_alignment = 85;
      score += 15;
    }
  }

  // Audience size consideration
  if (event.audience_size && event.audience_size > 100) {
    factors.audience_fit = 80;
    score += 10;
  }

  // Marketing goals alignment
  if (sponsor.marketing_goals && event.description) {
    const goalKeywords = sponsor.marketing_goals.toLowerCase();
    const eventDesc = event.description.toLowerCase();
    if (goalKeywords.includes('brand awareness') || eventDesc.includes('networking')) {
      factors.marketing_alignment = 85;
      score += 15;
    }
  }

  score = Math.min(100, Math.max(0, score));

  return {
    score: Math.round(score),
    reasoning: `Match score calculated based on budget compatibility (${factors.budget_compatibility}%), category alignment (${factors.category_alignment}%), audience fit (${factors.audience_fit}%), and marketing goals alignment (${factors.marketing_alignment}%). ${score > 75 ? 'Excellent match with strong alignment across multiple factors.' : score > 60 ? 'Good match with reasonable compatibility.' : 'Fair match with some alignment potential.'}`,
    factors
  };
}

async function getSingleMatch(supabase: any, eventId: string, sponsorId: string) {
  const { data: recommendation } = await supabase
    .from('recommendations')
    .select(`
      *,
      events (*),
      sponsors (*)
    `)
    .eq('event_id', eventId)
    .eq('sponsor_id', sponsorId)
    .single();

  return new Response(JSON.stringify({ recommendation }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

async function updateMatchStatus(supabase: any, eventId: string, sponsorId: string, updateData: any) {
  const { status, is_starred, is_viewed } = updateData;

  const updates: any = {};
  if (status !== undefined) updates.status = status;
  if (is_starred !== undefined) updates.is_starred = is_starred;
  if (is_viewed !== undefined) updates.is_viewed = is_viewed;
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('recommendations')
    .update(updates)
    .eq('event_id', eventId)
    .eq('sponsor_id', sponsorId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return new Response(JSON.stringify({ recommendation: data }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
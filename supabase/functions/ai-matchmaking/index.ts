import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting storage
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 100; // 100 requests per day
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new limit
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (userLimit.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    const { eventId, sponsorId, action } = requestBody;
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get auth user
    const authHeader = req.headers.get('Authorization')!;
    if (!authHeader) {
      throw new Error('Authorization header required');
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (!user) {
      throw new Error('Unauthorized');
    }

    // Check rate limit
    if (!checkRateLimit(user.id)) {
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded. Maximum 100 requests per day.' 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log request for monitoring
    console.log(`AI Matchmaking Request: ${action} by user ${user.id} at ${new Date().toISOString()}`);

    switch (action) {
      case 'generateRecommendations':
        return await generateRecommendations(supabase, user.id);
      case 'getSingleMatch':
        return await getSingleMatch(supabase, eventId, sponsorId);
      case 'updateMatchStatus':
        return await updateMatchStatus(supabase, eventId, sponsorId, requestBody);
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
  
  const GEMINI_API_KEY = 'AIzaSyAlA3unQELAAW5jeahTPKlu8xCiSLFTFmM';
  
  if (!GEMINI_API_KEY) {
    // Fallback scoring algorithm when API key is not available
    return calculateFallbackMatchScore(event, sponsor);
  }

  try {
    // Enhanced prompt for better AI matching
    const prompt = `
    You are an advanced AI matchmaking expert specializing in student event sponsorships. 
    Analyze the compatibility between this event and sponsor using sophisticated matching criteria.

    Event Details:
    - Title: ${event.title}
    - Category: ${event.category || 'Not specified'}
    - Description: ${event.description || 'No description'}
    - Location: ${event.location || 'Not specified'}
    - Budget Range: ${event.budget_range || 'Not specified'}
    - Audience Size: ${event.audience_size || 'Not specified'}
    - Date: ${event.event_date || 'Not specified'}
    - Engagement Metrics: ${JSON.stringify(event.engagement_metrics || {})}

    Sponsor Details:
    - Company: ${sponsor.company_name}
    - Industry: ${sponsor.industry || 'Not specified'}
    - Budget Range: ${sponsor.budget_range || 'Not specified'}
    - Marketing Goals: ${sponsor.marketing_goals || 'Not specified'}
    - Target Demographics: ${JSON.stringify(sponsor.target_demographics || [])}

    MATCHING CRITERIA (weights):
    1. Event theme/category compatibility (25%)
    2. Audience demographics alignment (20%) 
    3. Budget range compatibility (20%)
    4. Geographic proximity (15%)
    5. Industry preferences (10%)
    6. Marketing goals alignment (10%)

    Provide a JSON response with:
    1. A precise match score (0-100) based on weighted criteria
    2. Detailed reasoning explaining why this is/isn't a good match
    3. Specific matching factors with individual scores
    4. Actionable insights for both parties

    Response format:
    {
      "score": 87,
      "reasoning": "Excellent match due to strong alignment in target demographics and budget compatibility. The tech industry focus aligns perfectly with the AI workshop theme, and the sponsor's marketing goals of reaching young professionals match the event's audience profile.",
      "factors": {
        "theme_compatibility": 92,
        "audience_alignment": 88,
        "budget_compatibility": 85,
        "geographic_proximity": 75,
        "industry_preferences": 90,
        "marketing_alignment": 87
      },
      "insights": "This partnership could provide significant brand exposure to tech-savvy students while supporting innovative education initiatives."
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
          temperature: 0.2, // Lower temperature for more consistent scoring
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048, // Increased for detailed responses
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
        
        // Validate and sanitize the result
        if (result.score && result.reasoning && result.factors) {
          return {
            score: Math.min(100, Math.max(0, Math.round(result.score))),
            reasoning: result.reasoning.substring(0, 500), // Limit reasoning length
            factors: result.factors,
            insights: result.insights || ''
          };
        }
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
  
  let score = 40; // Base score
  const factors = {
    theme_compatibility: 50,
    audience_alignment: 50,
    budget_compatibility: 50,
    geographic_proximity: 50,
    industry_preferences: 50,
    marketing_alignment: 50
  };

  // Theme/Category compatibility (25% weight)
  if (event.category && sponsor.industry) {
    const compatibility = getCategoryIndustryCompatibility(event.category, sponsor.industry);
    factors.theme_compatibility = compatibility;
    score += (compatibility - 50) * 0.25;
  }

  // Audience alignment (20% weight)
  if (event.audience_size && sponsor.target_demographics) {
    const alignment = getAudienceAlignment(event, sponsor);
    factors.audience_alignment = alignment;
    score += (alignment - 50) * 0.20;
  }

  // Budget compatibility
  if (event.budget_range && sponsor.budget_range) {
    const compatibility = getBudgetCompatibility(event.budget_range, sponsor.budget_range);
    factors.budget_compatibility = compatibility;
    score += (compatibility - 50) * 0.20;
  }

  // Geographic proximity (15% weight)
  if (event.location && sponsor.location) {
    const proximity = getGeographicProximity(event.location, sponsor.location);
    factors.geographic_proximity = proximity;
    score += (proximity - 50) * 0.15;
  }

  // Industry preferences (10% weight)
  if (sponsor.industry && event.category) {
    const preference = getIndustryPreference(sponsor.industry, event.category);
    factors.industry_preferences = preference;
    score += (preference - 50) * 0.10;
  }

  // Marketing goals alignment (10% weight)
  if (sponsor.marketing_goals && event.description) {
    const alignment = getMarketingAlignment(sponsor.marketing_goals, event.description);
    factors.marketing_alignment = alignment;
    score += (alignment - 50) * 0.10;
  }

  score = Math.min(100, Math.max(0, score));

  return {
    score: Math.round(score),
    reasoning: `Match score calculated using weighted criteria: theme compatibility (${factors.theme_compatibility}%), audience alignment (${factors.audience_alignment}%), budget compatibility (${factors.budget_compatibility}%), geographic proximity (${factors.geographic_proximity}%), industry preferences (${factors.industry_preferences}%), and marketing alignment (${factors.marketing_alignment}%). ${score > 80 ? 'Excellent match with strong alignment across multiple factors.' : score > 65 ? 'Good match with reasonable compatibility.' : score > 50 ? 'Fair match with some alignment potential.' : 'Limited compatibility - consider if strategic value exists.'}`,
    factors,
    insights: score > 75 ? 'High potential for successful partnership with mutual benefits.' : 'Consider discussing specific collaboration opportunities to maximize value.'
  };
}

function getCategoryIndustryCompatibility(category: string, industry: string): number {
  const compatibilityMatrix: Record<string, Record<string, number>> = {
    'technology': { 'Technology': 95, 'Finance': 75, 'Healthcare': 70, 'Education': 85 },
    'business': { 'Finance': 90, 'Technology': 80, 'Consulting': 95, 'Real Estate': 75 },
    'cultural': { 'Media & Entertainment': 90, 'Arts': 95, 'Tourism': 85, 'Food & Beverage': 80 },
    'sports': { 'Sports': 95, 'Healthcare': 80, 'Energy': 70, 'Retail': 75 },
    'academic': { 'Education': 95, 'Technology': 85, 'Healthcare': 80, 'Research': 90 }
  };

  const categoryLower = category.toLowerCase();
  const industryMatrix = compatibilityMatrix[categoryLower];
  
  if (industryMatrix && industryMatrix[industry]) {
    return industryMatrix[industry];
  }
  
  // Fallback to keyword matching
  const categoryWords = categoryLower.split(' ');
  const industryWords = industry.toLowerCase().split(' ');
  const hasMatch = categoryWords.some(word => 
    industryWords.some(ind => ind.includes(word) || word.includes(ind))
  );
  
  return hasMatch ? 75 : 45;
}

function getAudienceAlignment(event: any, sponsor: any): number {
  let alignment = 50;
  
  // Audience size scoring
  if (event.audience_size) {
    if (event.audience_size >= 1000) alignment += 20;
    else if (event.audience_size >= 500) alignment += 15;
    else if (event.audience_size >= 200) alignment += 10;
    else if (event.audience_size >= 100) alignment += 5;
  }
  
  // Demographics matching
  if (sponsor.target_demographics && Array.isArray(sponsor.target_demographics)) {
    const eventDemographics = ['College Students', 'Young Professionals', 'Tech Enthusiasts'];
    const matches = sponsor.target_demographics.filter(demo => 
      eventDemographics.some(eventDemo => 
        eventDemo.toLowerCase().includes(demo.toLowerCase()) ||
        demo.toLowerCase().includes(eventDemo.toLowerCase())
      )
    );
    alignment += matches.length * 10;
  }
  
  return Math.min(95, alignment);
}

function getBudgetCompatibility(eventBudget: string, sponsorBudget: string): number {
  const budgetRanges = [
    '$500 - $1,000',
    '$1,000 - $2,500', 
    '$2,500 - $5,000',
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000+'
  ];
  
  const eventIndex = budgetRanges.indexOf(eventBudget);
  const sponsorIndex = budgetRanges.indexOf(sponsorBudget);
  
  if (eventIndex === -1 || sponsorIndex === -1) return 50;
  
  const difference = Math.abs(eventIndex - sponsorIndex);
  
  if (difference === 0) return 95;
  if (difference === 1) return 80;
  if (difference === 2) return 65;
  return 40;
}

function getGeographicProximity(eventLocation: string, sponsorLocation: string): number {
  // Simplified geographic matching - in production, use proper geocoding
  if (eventLocation.toLowerCase() === sponsorLocation.toLowerCase()) return 95;
  
  const eventWords = eventLocation.toLowerCase().split(/[\s,]+/);
  const sponsorWords = sponsorLocation.toLowerCase().split(/[\s,]+/);
  
  const hasCommonLocation = eventWords.some(word => 
    sponsorWords.some(sponsorWord => 
      word.includes(sponsorWord) || sponsorWord.includes(word)
    )
  );
  
  return hasCommonLocation ? 80 : 45;
}

function getIndustryPreference(industry: string, category: string): number {
  // Industry-specific preferences for event categories
  const preferences: Record<string, string[]> = {
    'Technology': ['technology', 'academic', 'workshop', 'conference'],
    'Finance': ['business', 'academic', 'networking', 'conference'],
    'Healthcare': ['academic', 'sports', 'wellness', 'research'],
    'Education': ['academic', 'workshop', 'conference', 'cultural'],
    'Media & Entertainment': ['cultural', 'arts', 'music', 'sports']
  };
  
  const industryPrefs = preferences[industry] || [];
  const categoryLower = category.toLowerCase();
  
  const hasPreference = industryPrefs.some(pref => 
    categoryLower.includes(pref) || pref.includes(categoryLower)
  );
  
  return hasPreference ? 85 : 45;
}

function getMarketingAlignment(marketingGoals: string, eventDescription: string): number {
  const goals = marketingGoals.toLowerCase();
  const description = eventDescription.toLowerCase();
  
  const alignmentKeywords = [
    { keywords: ['brand awareness', 'visibility', 'exposure'], weight: 20 },
    { keywords: ['networking', 'community', 'engagement'], weight: 15 },
    { keywords: ['innovation', 'technology', 'future'], weight: 15 },
    { keywords: ['education', 'learning', 'development'], weight: 10 },
    { keywords: ['leadership', 'professional', 'career'], weight: 10 }
  ];
  
  let alignment = 50;
  
  alignmentKeywords.forEach(({ keywords, weight }) => {
    const hasGoalKeyword = keywords.some(keyword => goals.includes(keyword));
    const hasDescKeyword = keywords.some(keyword => description.includes(keyword));
    
    if (hasGoalKeyword && hasDescKeyword) {
      alignment += weight;
    }
  });
  
  return Math.min(95, alignment);
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
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
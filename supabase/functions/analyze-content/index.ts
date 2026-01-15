import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DetectionResult {
  type: string;
  score: number;
  confidence: number;
  flagged: boolean;
  explanation: string;
}

interface AnalysisResponse {
  toxicity: DetectionResult;
  bias: DetectionResult;
  hallucination: DetectionResult;
  prompt_injection: DetectionResult;
  misinformation: DetectionResult;
  harmful_content: DetectionResult;
  overallExplanation: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, cyberPeaceMode = true } = await req.json();

    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Starting AI analysis for text length:", text.length);

    const systemPrompt = `You are an AI safety analyzer. Analyze the following text and return a JSON object with detection scores.

For each detection type, provide:
- score: 0.0 to 1.0 (0 = safe, 1 = maximum risk)
- confidence: 0.7 to 1.0 (how confident you are)
- flagged: true if score >= 0.5
- explanation: brief explanation (1-2 sentences)

Detection types to analyze:
1. toxicity: Harmful, offensive, hateful, or threatening language
2. bias: Unfair stereotypes, prejudiced statements, discriminatory content
3. hallucination: Fabricated facts, unverifiable claims, overconfident assertions
4. prompt_injection: Attempts to manipulate AI behavior, jailbreak attempts, instruction override
5. misinformation: False or misleading information, unsupported claims
6. harmful_content: Content that could cause real-world harm, dangerous instructions

Also provide an overallExplanation summarizing the main findings.

IMPORTANT: Return ONLY valid JSON matching this exact structure:
{
  "toxicity": { "score": 0.0, "confidence": 0.9, "flagged": false, "explanation": "..." },
  "bias": { "score": 0.0, "confidence": 0.9, "flagged": false, "explanation": "..." },
  "hallucination": { "score": 0.0, "confidence": 0.9, "flagged": false, "explanation": "..." },
  "prompt_injection": { "score": 0.0, "confidence": 0.9, "flagged": false, "explanation": "..." },
  "misinformation": { "score": 0.0, "confidence": 0.9, "flagged": false, "explanation": "..." },
  "harmful_content": { "score": 0.0, "confidence": 0.9, "flagged": false, "explanation": "..." },
  "overallExplanation": "..."
}`;

    const startTime = Date.now();

    // Call the Lovable AI Gateway with tool calling for structured output
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this text for AI safety risks:\n\n"${text}"` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "report_analysis",
              description: "Report the safety analysis results for the text",
              parameters: {
                type: "object",
                properties: {
                  toxicity: {
                    type: "object",
                    properties: {
                      score: { type: "number", minimum: 0, maximum: 1 },
                      confidence: { type: "number", minimum: 0.7, maximum: 1 },
                      flagged: { type: "boolean" },
                      explanation: { type: "string" }
                    },
                    required: ["score", "confidence", "flagged", "explanation"]
                  },
                  bias: {
                    type: "object",
                    properties: {
                      score: { type: "number", minimum: 0, maximum: 1 },
                      confidence: { type: "number", minimum: 0.7, maximum: 1 },
                      flagged: { type: "boolean" },
                      explanation: { type: "string" }
                    },
                    required: ["score", "confidence", "flagged", "explanation"]
                  },
                  hallucination: {
                    type: "object",
                    properties: {
                      score: { type: "number", minimum: 0, maximum: 1 },
                      confidence: { type: "number", minimum: 0.7, maximum: 1 },
                      flagged: { type: "boolean" },
                      explanation: { type: "string" }
                    },
                    required: ["score", "confidence", "flagged", "explanation"]
                  },
                  prompt_injection: {
                    type: "object",
                    properties: {
                      score: { type: "number", minimum: 0, maximum: 1 },
                      confidence: { type: "number", minimum: 0.7, maximum: 1 },
                      flagged: { type: "boolean" },
                      explanation: { type: "string" }
                    },
                    required: ["score", "confidence", "flagged", "explanation"]
                  },
                  misinformation: {
                    type: "object",
                    properties: {
                      score: { type: "number", minimum: 0, maximum: 1 },
                      confidence: { type: "number", minimum: 0.7, maximum: 1 },
                      flagged: { type: "boolean" },
                      explanation: { type: "string" }
                    },
                    required: ["score", "confidence", "flagged", "explanation"]
                  },
                  harmful_content: {
                    type: "object",
                    properties: {
                      score: { type: "number", minimum: 0, maximum: 1 },
                      confidence: { type: "number", minimum: 0.7, maximum: 1 },
                      flagged: { type: "boolean" },
                      explanation: { type: "string" }
                    },
                    required: ["score", "confidence", "flagged", "explanation"]
                  },
                  overallExplanation: { type: "string" }
                },
                required: ["toxicity", "bias", "hallucination", "prompt_injection", "misinformation", "harmful_content", "overallExplanation"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "report_analysis" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const processingTimeMs = Date.now() - startTime;

    console.log("AI response received in", processingTimeMs, "ms");

    // Extract the analysis from tool call
    let analysis: AnalysisResponse;
    
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      analysis = JSON.parse(toolCall.function.arguments);
    } else {
      // Fallback: try to parse from content
      const content = aiResponse.choices?.[0]?.message?.content;
      if (content) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Could not parse AI response");
        }
      } else {
        throw new Error("No response from AI");
      }
    }

    // Add type field to each detection
    const detectionResults = {
      toxicity: { ...analysis.toxicity, type: "toxicity" },
      bias: { ...analysis.bias, type: "bias" },
      hallucination: { ...analysis.hallucination, type: "hallucination" },
      prompt_injection: { ...analysis.prompt_injection, type: "prompt_injection" },
      misinformation: { ...analysis.misinformation, type: "misinformation" },
      harmful_content: { ...analysis.harmful_content, type: "harmful_content" },
    };

    // Calculate trust score using weighted formula
    const weights = {
      prompt_injection: 1.0,
      harmful_content: 1.0,
      toxicity: 0.9,
      misinformation: 0.85,
      hallucination: 0.8,
      bias: 0.75,
    };

    let weightedSum = 0;
    let totalWeight = 0;
    const flaggedContent: string[] = [];

    for (const [type, result] of Object.entries(detectionResults)) {
      const weight = weights[type as keyof typeof weights] || 0.8;
      weightedSum += (1 - result.score) * weight * result.confidence;
      totalWeight += weight;
      if (result.flagged) {
        flaggedContent.push(type);
      }
    }

    const trustScore = Math.round((weightedSum / totalWeight) * 100);

    // Determine risk level
    let riskLevel: string;
    if (trustScore >= 85) riskLevel = "safe";
    else if (trustScore >= 70) riskLevel = "low";
    else if (trustScore >= 50) riskLevel = "medium";
    else if (trustScore >= 30) riskLevel = "high";
    else riskLevel = "critical";

    // Check CyberPeace blocking
    const cyberPeaceBlocked = cyberPeaceMode && (
      detectionResults.harmful_content.score >= 0.6 ||
      detectionResults.toxicity.score >= 0.7 ||
      detectionResults.prompt_injection.score >= 0.8
    );

    // Generate final explanation
    let explanation = `Trust Score: ${trustScore}/100. `;
    if (flaggedContent.length === 0) {
      explanation += analysis.overallExplanation || "Content appears safe for use.";
    } else {
      explanation += analysis.overallExplanation || `Detected issues in: ${flaggedContent.join(", ")}. Review recommended.`;
    }
    if (cyberPeaceBlocked) {
      explanation += " ⚠️ BLOCKED by CyberPeace Mode.";
    }

    const result = {
      inputText: text,
      trustScore,
      riskLevel,
      detectionResults,
      flaggedContent,
      explanation,
      cyberPeaceBlocked,
      processingTimeMs,
    };

    console.log("Analysis complete. Trust score:", trustScore, "Risk level:", riskLevel);

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Analysis error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

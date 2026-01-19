import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  // Get the user's message from the request
  try {
    const { message } = await req.json();

    // Create Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Call Claude API
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024, //limits response to approx. 750 words
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    // Return Claude's response
    const responseText = (response.content[0] as { text: string }).text;
    return Response.json({
      reply: responseText,
    });
  } catch (error) {
    console.error("Claude API error:", error);
    return Response.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}

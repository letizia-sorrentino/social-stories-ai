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
    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024, //limits response to approx. 750 words
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    // Create a text encoder to convert strings to bytes
    const encoder = new TextEncoder();

    // Create a ReadableStream that the browser can consume
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          // Loop through each chunk from Claude
          for await (const chunk of stream) {
            // Check if this chunk contains text
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              // Get the text from this chunk
              const text = chunk.delta.text;
              // Send it to the browser
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });
    // Return the stream to the browser
    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Claude API error:", error);
    return Response.json(
      { error: "Failed to generate response" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
  return Response.json({
    message: "Hello from API!",
    apiKeyConfigured: hasApiKey,
  });
}

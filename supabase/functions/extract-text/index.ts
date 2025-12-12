import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestPayload {
  imageUrl: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { imageUrl }: RequestPayload = await req.json();

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: "Image URL is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const ocrApiKey = Deno.env.get("OCR_SPACE_API_KEY") || "helloworld";

    const formData = new FormData();
    formData.append("url", imageUrl);
    formData.append("language", "spa");
    formData.append("isOverlayRequired", "false");
    formData.append("detectOrientation", "true");
    formData.append("scale", "true");
    formData.append("OCREngine", "2");

    const ocrResponse = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: {
        "apikey": ocrApiKey,
      },
      body: formData,
    });

    if (!ocrResponse.ok) {
      throw new Error("OCR API request failed");
    }

    const ocrData = await ocrResponse.json();

    let extractedText = "";

    if (ocrData.ParsedResults && ocrData.ParsedResults.length > 0) {
      extractedText = ocrData.ParsedResults[0].ParsedText || "";
    }

    return new Response(
      JSON.stringify({ text: extractedText }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error extracting text:", error);
    return new Response(
      JSON.stringify({ error: "Failed to extract text from image", text: "" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
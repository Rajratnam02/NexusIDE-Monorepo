// Maps Monaco Editor language identifiers to Piston API runtime names
const LANGUAGE_MAP = {
  javascript: { language: "javascript", version: "*" },
  typescript: { language: "typescript", version: "*" },
  python:     { language: "python",     version: "*" },
  java:       { language: "java",       version: "*" },
  cpp:        { language: "c++",        version: "*" },
  c:          { language: "c",          version: "*" },
  go:         { language: "go",         version: "*" },
  rust:       { language: "rust",       version: "*" },
  php:        { language: "php",        version: "*" },
  ruby:       { language: "ruby",       version: "*" },
  kotlin:     { language: "kotlin",     version: "*" },
  swift:      { language: "swift",      version: "*" },
  bash:       { language: "bash",       version: "*" },
  csharp:     { language: "csharp",     version: "*" },
};

const PISTON_URLS = [
  "https://emkc.org/api/v2/piston/execute",
  "https://emkc.org/api/v1/piston/execute",
];
const TIMEOUT_MS = 15000;

export const executeCode = async (req, res) => {
  try {
    const { language, code } = req.body;

    const runtime = LANGUAGE_MAP[language];
    if (!runtime) {
      return res.status(400).json({
        success: false,
        message: `Language "${language}" is not supported. Supported: ${Object.keys(LANGUAGE_MAP).join(", ")}`,
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let pistonRes;
    let lastError;

    // Try primary Piston endpoint
    try {
      pistonRes = await fetch(PISTON_URLS[0], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "NexusIDE/1.0",
        },
        signal: controller.signal,
        body: JSON.stringify({
          language: runtime.language,
          version: runtime.version,
          files: [{ name: `main`, content: code }],
        }),
      });
    } catch (fetchErr) {
      lastError = fetchErr;
      console.error("[Execute] Primary Piston fetch error:", fetchErr.message);
    } finally {
      clearTimeout(timeoutId);
    }

    // Handle timeout
    if (lastError?.name === "AbortError") {
      return res.status(504).json({
        success: false,
        message: "Code execution timed out after 15 seconds.",
      });
    }

    // Handle unreachable
    if (!pistonRes) {
      return res.status(503).json({
        success: false,
        message: "Code execution service is temporarily unavailable. Please try again.",
      });
    }

    if (!pistonRes.ok) {
      const errorBody = await pistonRes.text().catch(() => "(unreadable)");
      console.error(`[Execute] Piston returned HTTP ${pistonRes.status}:`, errorBody);
      return res.status(502).json({
        success: false,
        message: `Execution engine error (HTTP ${pistonRes.status}). Please try again shortly.`,
        detail: errorBody,
      });
    }

    const data = await pistonRes.json();
    const { run } = data;

    return res.status(200).json({
      success: true,
      data: {
        stdout:   run.stdout  || "",
        stderr:   run.stderr  || "",
        exitCode: run.code    ?? null,
        language: runtime.language,
      },
    });
  } catch (error) {
    console.error("[Execute] Unexpected error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during code execution.",
    });
  }
};

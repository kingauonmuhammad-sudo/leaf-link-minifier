const express = require("express");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = 3000;
const urls = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/urls", (req, res) => {
  res.json(urls);
});

app.get("/:id", (req, res) => {
  const savedUrl = urls.find((item) => item.id === req.params.id);

  if (!savedUrl) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Link Not Found</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/junaidprodeveloper/Iconic@main/iconic.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/junaidprodeveloper/Iconic@main/iconic-framework.css">
      </head>
      <body class="ic-bg-green-50">
        <section class="ic-container ic-padding-y-12 ic-d-flex ic-justify-center">
          <div class="ic-w-full ic-max-w-112 ic-bg-white ic-border-2 ic-border-solid ic-border-green-200 ic-shadow-md ic-padding-8 ic-text-center ic-rounded-none">
            <i-ic class="ic-link-45deg ic-3x ic-text-green-300 ic-margin-bottom-3"></i-ic>
            <h2 class="ic-playf ic-extrabold ic-xlarge ic-text-green-700 ic-margin-0 ic-margin-bottom-2">Link Not Found</h2>
            <p class="ic-merri ic-smmed ic-text-green-900 ic-leading-relaxed ic-margin-bottom-6">
              This short link doesn't exist or may have expired.
            </p>
            <a href="/" class="ic-d-inline-flex ic-items-center ic-gap-2 ic-poppi ic-smmed ic-semi ic-none ic-cursor-pointer ic-bg-green-600 ic-bg-green-700-hover ic-text-white ic-border-2 ic-border-solid ic-border-green-600 ic-padding-x-5 ic-padding-y-2 ic-rounded-none">
              <i-ic class="ic-arrow-left ic-1x"></i-ic>
              Back to Shortener
            </a>
          </div>
        </section>
      </body>
      </html>
    `);
  }

  res.redirect(savedUrl.url);
});

app.post("/submit/url", (req, res) => {
  const { url } = req.body || {};

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return res.status(400).json({ error: "Only HTTP and HTTPS URLs are allowed" });
    }
  } catch {
    return res.status(400).json({ error: "Please provide a valid URL" });
  }

  const id = crypto.randomBytes(2).toString("hex");
  urls.push({ id, url });

  res.status(201).send(`/${id}`);
});

app.use((req, res) => {
  res.status(404).json({ error: "404 - Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

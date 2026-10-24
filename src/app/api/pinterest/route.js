import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

function isPinterestUrl(value) {
  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      ["pinterest.com", "www.pinterest.com", "pin.it", "www.pin.it"].includes(
        url.hostname,
      ) &&
      !url.port &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

function isPinImage(value) {
  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      url.hostname === "i.pinimg.com" &&
      !url.port &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

async function fetchPinterestPage(initialUrl) {
  let currentUrl = initialUrl;

  for (let i = 0; i < 4; i++) {
    if (!isPinterestUrl(currentUrl)) {
      throw new Error("Unsupported Pinterest URL");
    }

    const response = await fetch(currentUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
        Accept: "text/html",
      },
      redirect: "manual",
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");

      if (!location) {
        throw new Error("Redirect URL missing");
      }

      currentUrl = new URL(location, currentUrl).href;
      continue;
    }

    if (!response.ok) {
      throw new Error(`Pinterest returned ${response.status}`);
    }

    return await response.text();
  }

  throw new Error("Too many redirects");
}

// Get original quality when available.
// Fall back to the working image URL.
async function getBestImage(image) {
  if (!isPinImage(image)) return image;

  try {
    const url = new URL(image);

    const originalUrl = new URL(url.toString());

    originalUrl.pathname = originalUrl.pathname.replace(
      /^\/(?:\d+x\d*|\d+x)\//,
      "/originals/",
    );

    if (originalUrl.href === url.href) {
      return image;
    }

    const response = await fetch(originalUrl.href, {
      method: "GET",
      redirect: "error",
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });

    if (
      response.ok &&
      response.headers.get("content-type")?.startsWith("image/")
    ) {
      await response.body?.cancel();
      return originalUrl.href;
    }

    await response.body?.cancel();
  } catch (error) {
    console.log("Original quality unavailable:", error.message);
  }

  return image;
}

async function parsePin(html) {
  const $ = cheerio.load(html);

  const title =
    $('meta[property="og:title"]').attr("content") || "Pinterest Image";

  const thumbnail =
    $('meta[property="og:image"]').attr("content") ||
    $('meta[name="twitter:image"]').attr("content");

  if (!thumbnail || !isPinImage(thumbnail)) {
    return NextResponse.json(
      {
        success: false,
        message: "No downloadable image found for this Pin",
      },
      { status: 404 },
    );
  }

  const bestImage = await getBestImage(thumbnail);

  return NextResponse.json({
    success: true,
    message: "Pinterest image found",
    data: {
      title,
      image: bestImage,
      thumbnail,
      quality:
        bestImage !== thumbnail ? "Original quality" : "Available quality",
      downloadUrl: `/api/download?image=${encodeURIComponent(bestImage)}`,
    },
  });
}

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (typeof url !== "string" || !isPinterestUrl(url)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid Pinterest URL",
        },
        { status: 400 },
      );
    }

    const html = await fetchPinterestPage(url);

    return await parsePin(html);
  } catch (error) {
    console.error("Pinterest API Error:", error.message);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to extract this Pinterest image. Please try another public Pin.",
      },
      { status: 422 },
    );
  }
}

import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const image = searchParams.get("image");

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          message: "Image URL is required",
        },
        { status: 400 },
      );
    }

    const imageUrl = new URL(image);

    if (
      imageUrl.protocol !== "https:" ||
      imageUrl.hostname !== "i.pinimg.com" ||
      imageUrl.port ||
      imageUrl.username ||
      imageUrl.password
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Pinterest image URL",
        },
        { status: 400 },
      );
    }

    const response = await fetch(imageUrl.toString(), {
      method: "GET",
      redirect: "error",
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Image server returned ${response.status}`);
    }

    const contentType = (response.headers.get("content-type") || "")
      .split(";")[0]
      .trim()
      .toLowerCase();

    const formats = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
    };

    const extension = formats[contentType];

    if (!extension) {
      throw new Error("Unsupported image format");
    }

    const maxSize = 15 * 1024 * 1024;
    const declaredSize = Number(response.headers.get("content-length") || 0);

    if (declaredSize > maxSize) {
      throw new Error("Image exceeds 15 MB limit");
    }

    if (!response.body) {
      throw new Error("Image response is empty");
    }

    const chunks = [];
    let total = 0;

    for await (const chunk of response.body) {
      total += chunk.length;

      if (total > maxSize) {
        throw new Error("Image exceeds 15 MB limit");
      }

      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    if (!buffer.length) {
      throw new Error("Downloaded image is empty");
    }

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="pinterest-image.${extension}"`,
        "Content-Length": String(buffer.length),
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Download API Error:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to download this Pinterest image",
      },
      { status: 422 },
    );
  }
}

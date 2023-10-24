import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
interface NextRequestWithImage extends NextRequest {
  imageUrl: string;
}

export async function POST(req: NextRequestWithImage, res: NextResponse) {
  const { imageUrl } = await req.json();

  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (!session || error)
    new NextResponse("loging in order to restore the image", {
      status: 500,
    });

  const startRestoreProcess = await fetch(
    "https://api.replicate.com/v1/predictions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token" + process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN,
      },
      body: JSON.stringify({
        version:
          "297a243ce8643961d52f745f9b6c8c1bd96850a51c92be5f43628a0d3e08321a",
        input: {
          img: imageUrl,
        },
      }),
    }
  );

  let jsonStartProcessResponse = await startRestoreProcess.json();
  let endpointUrl = jsonStartProcessResponse.urls.get;

  let restoredImage: string | null = null;

  while (!restoredImage) {
    let finalResponse = await fetch(endpointUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token" + process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN,
      },
    });

    let jsonFinalResponse = await finalResponse.json();
    if (jsonFinalResponse.status === "succeeded") {
      restoredImage = jsonFinalResponse.output;
    } else if (jsonFinalResponse.status === "failed") {
      break;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return NextResponse.json(
    {
      data: restoredImage ? restoredImage : "Failed to restore Image",
    },
    {
      status: 200,
    }
  );
}

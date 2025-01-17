import connectDB from "@/lib/connectDB";
import { RequestModal } from "@/lib/models/RequestModel";
export async function GET(req, { params }) {
  await connectDB();

  const requests = await RequestModal.findOne({ _id: params.id }).populate(
    "user"
  );
  return Response.json(
    {
      error: false,
      msg: "Single Request fetched Successfully",
      requests,
    },
    { status: 200 }
  );
}

export async function DELETE(req) {}
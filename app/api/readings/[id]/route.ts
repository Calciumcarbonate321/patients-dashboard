import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: readingId } = await params

  // Query the readings table for all readings with this patient id
  const { data, error } = await supabase.from("readings").select("file_path").eq("id", readingId)

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  // Extract ids as array
  const url = supabase.storage.from("readings").getPublicUrl(data[0].file_path)
  return NextResponse.json({
    success: true,
    url: url.data.publicUrl,
  })
}

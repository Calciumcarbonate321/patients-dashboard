import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

interface ReadingRow {
  file_path: string
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const patient = await supabase.from('patients').select('*').eq('id', id).single()
  if (patient.error) {
    return NextResponse.json({ success: false, error: patient.error.message }, { status: 500 })
  }
  const readings = (await supabase.from('readings').select('*').eq('patient_id', id).order('created_at', { ascending: false }))
  if (!patient) {
    return NextResponse.json({ success: false, error: "Patient not found" }, { status: 404 })
  } 

  return NextResponse.json({
    success: true,
    data: {
      patient,
      readings
    },
  })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: readingRows, error: readingError } = await supabase.from('readings').select('file_path').eq('patient_id', id)
  if (readingError) {
    return NextResponse.json({ success: false, error: readingError.message }, { status: 500 })
  }
  if (readingRows && readingRows.length > 0) {
    const filePaths = (readingRows as ReadingRow[]).map((row) => row.file_path).filter(Boolean)
    if (filePaths.length > 0) {
      const { error: storageError } = await supabase.storage.from('readings').remove(filePaths)
      if (storageError) {
        return NextResponse.json({ success: false, error: storageError.message }, { status: 500 })
      }
    }
  }
  const { error } = await supabase.from('patients').delete().eq('id', id)
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true, message: "Patient deleted successfully" }, { status: 200 })
}
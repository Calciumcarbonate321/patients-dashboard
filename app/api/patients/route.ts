import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  const patients = await supabase.from('patients').select('*')
  console.log(patients)
  return NextResponse.json({
    success: true,
    data: patients.data,
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const newPatient = {
      name: body.name,
      age: body.age,
      email: body.email,
      readings_count: 0,
    }

    const res = await supabase.from('patients').insert(newPatient).select().single()
    console.log(res)

    if (res.error) {
      return NextResponse.json({ success: false, error: res.error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: res.data,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 })
  }
}

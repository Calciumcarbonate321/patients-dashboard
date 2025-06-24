import { type NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
    //csv file upload
    const formData = await request.formData();
    const patientId = formData.get("patientId") as string;
    const file = formData.get("file") as File;
    if (!file) {
        return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }
    //store file as object in supabase
    const {data, error} = await supabase.storage.from('readings').upload(`${file.name}`, file)
    const filePath = data?.path
    
    if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    }
    const res = await supabase.from('readings').insert({patient_id:patientId, file_path: filePath})
    // Increment readings_count
    const { data: patient, error: patientError } = await supabase.from('patients').select('readings_count').eq('id', patientId).single();
    if (!patientError && patient) {
        const newCount = (patient.readings_count || 0) + 1;
        await supabase.from('patients').update({ readings_count: newCount }).eq('id', patientId);
    }
    return NextResponse.json({ success: true, data: data }, { status: 200 });
}


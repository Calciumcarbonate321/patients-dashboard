import { NextResponse } from "next/server"

// Mock patient data
const patients = [
  {
    id: "1",
    name: "John Doe",
    age: 45,
    email: "john.doe@email.com",
    phone: "+1-555-0123",
    lastVisit: "2024-01-15",
    readingsCount: 12,
  },
  {
    id: "2",
    name: "Jane Smith",
    age: 32,
    email: "jane.smith@email.com",
    phone: "+1-555-0124",
    lastVisit: "2024-01-14",
    readingsCount: 8,
  },
  {
    id: "3",
    name: "Bob Johnson",
    age: 58,
    email: "bob.johnson@email.com",
    phone: "+1-555-0125",
    lastVisit: "2024-01-13",
    readingsCount: 15,
  },
  {
    id: "4",
    name: "Alice Brown",
    age: 29,
    email: "alice.brown@email.com",
    phone: "+1-555-0126",
    lastVisit: "2024-01-12",
    readingsCount: 6,
  },
  {
    id: "5",
    name: "Charlie Wilson",
    age: 41,
    email: "charlie.wilson@email.com",
    phone: "+1-555-0127",
    lastVisit: "2024-01-11",
    readingsCount: 10,
  },
]

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json({
    success: true,
    data: patients,
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const newPatient = {
      id: (patients.length + 1).toString(),
      name: body.name,
      age: body.age,
      email: body.email,
      phone: body.phone,
      lastVisit: new Date().toISOString().split("T")[0],
      readingsCount: 0,
    }

    patients.push(newPatient)

    return NextResponse.json({
      success: true,
      data: newPatient,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create patient" }, { status: 500 })
  }
}

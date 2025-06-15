import { NextResponse } from "next/server"

// Generate mock sensor data with timestamps
function generateSensorData(count: number, startTime: Date) {
  const data = []
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(startTime.getTime() + i * 100) // 100ms intervals
    data.push({
      timestamp: timestamp.toISOString(),
      accelerometerX: Number.parseFloat((Math.random() * 2 - 1).toFixed(3)),
      accelerometerY: Number.parseFloat((9.8 + Math.random() * 0.4 - 0.2).toFixed(3)),
      accelerometerZ: Number.parseFloat((Math.random() * 1 - 0.5).toFixed(3)),
      gyroscopeX: Number.parseFloat((Math.random() * 0.5 - 0.25).toFixed(3)),
      gyroscopeY: Number.parseFloat((Math.random() * 0.4 - 0.2).toFixed(3)),
      gyroscopeZ: Number.parseFloat((Math.random() * 0.3 - 0.15).toFixed(3)),
    })
  }
  return data
}

// Mock patient data with IMU gait readings
const patientReadings = {
  "1": [
    {
      id: "r1",
      patientId: "1",
      date: "2024-01-15",
      timestamp: "2024-01-15T10:30:00Z",
      duration: 30,
      stepCount: 45,
      avgCadence: 90,
      sensorData: generateSensorData(300, new Date("2024-01-15T10:30:00Z")),
    },
    {
      id: "r2",
      patientId: "1",
      date: "2024-01-10",
      timestamp: "2024-01-10T14:15:00Z",
      duration: 25,
      stepCount: 38,
      avgCadence: 91,
      sensorData: generateSensorData(250, new Date("2024-01-10T14:15:00Z")),
    },
    {
      id: "r3",
      patientId: "1",
      date: "2024-01-05",
      timestamp: "2024-01-05T16:20:00Z",
      duration: 35,
      stepCount: 52,
      avgCadence: 89,
      sensorData: generateSensorData(350, new Date("2024-01-05T16:20:00Z")),
    },
  ],
  "2": [
    {
      id: "r4",
      patientId: "2",
      date: "2024-01-14",
      timestamp: "2024-01-14T09:45:00Z",
      duration: 35,
      stepCount: 52,
      avgCadence: 89,
      sensorData: generateSensorData(350, new Date("2024-01-14T09:45:00Z")),
    },
    {
      id: "r5",
      patientId: "2",
      date: "2024-01-08",
      timestamp: "2024-01-08T11:30:00Z",
      duration: 28,
      stepCount: 42,
      avgCadence: 90,
      sensorData: generateSensorData(280, new Date("2024-01-08T11:30:00Z")),
    },
  ],
  "3": [
    {
      id: "r6",
      patientId: "3",
      date: "2024-01-13",
      timestamp: "2024-01-13T15:00:00Z",
      duration: 40,
      stepCount: 58,
      avgCadence: 87,
      sensorData: generateSensorData(400, new Date("2024-01-13T15:00:00Z")),
    },
  ],
  "4": [
    {
      id: "r7",
      patientId: "4",
      date: "2024-01-12",
      timestamp: "2024-01-12T13:20:00Z",
      duration: 22,
      stepCount: 33,
      avgCadence: 90,
      sensorData: generateSensorData(220, new Date("2024-01-12T13:20:00Z")),
    },
  ],
  "5": [
    {
      id: "r8",
      patientId: "5",
      date: "2024-01-11",
      timestamp: "2024-01-11T08:15:00Z",
      duration: 32,
      stepCount: 48,
      avgCadence: 90,
      sensorData: generateSensorData(320, new Date("2024-01-11T08:15:00Z")),
    },
  ],
}

const patients = [
  { id: "1", name: "John Doe", age: 45, email: "john.doe@email.com", phone: "+1-555-0123" },
  { id: "2", name: "Jane Smith", age: 32, email: "jane.smith@email.com", phone: "+1-555-0124" },
  { id: "3", name: "Bob Johnson", age: 58, email: "bob.johnson@email.com", phone: "+1-555-0125" },
  { id: "4", name: "Alice Brown", age: 29, email: "alice.brown@email.com", phone: "+1-555-0126" },
  { id: "5", name: "Charlie Wilson", age: 41, email: "charlie.wilson@email.com", phone: "+1-555-0127" },
]

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const patient = patients.find((p) => p.id === id)
  const readings = patientReadings[id as keyof typeof patientReadings] || []

  if (!patient) {
    return NextResponse.json({ success: false, error: "Patient not found" }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    data: {
      patient,
      readings,
    },
  })
}

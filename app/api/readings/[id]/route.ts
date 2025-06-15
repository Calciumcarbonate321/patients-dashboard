import { NextResponse } from "next/server"

// Generate mock sensor data with timestamps
function generateSensorData(count: number, startTime: Date) {
  const data = []
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(startTime.getTime() + i * 100) // 100ms intervals
    data.push({
      timestamp: timestamp.toISOString(),
      accelerometerX: Number.parseFloat((Math.random() * 2 - 1).toFixed(3)), // -1 to 1
      accelerometerY: Number.parseFloat((9.8 + Math.random() * 0.4 - 0.2).toFixed(3)), // ~9.8 ± 0.2
      accelerometerZ: Number.parseFloat((Math.random() * 1 - 0.5).toFixed(3)), // -0.5 to 0.5
      gyroscopeX: Number.parseFloat((Math.random() * 0.5 - 0.25).toFixed(3)), // -0.25 to 0.25
      gyroscopeY: Number.parseFloat((Math.random() * 0.4 - 0.2).toFixed(3)), // -0.2 to 0.2
      gyroscopeZ: Number.parseFloat((Math.random() * 0.3 - 0.15).toFixed(3)), // -0.15 to 0.15
    })
  }
  return data
}

// Mock IMU readings data
const allReadings = [
  {
    id: "r1",
    patientId: "1",
    patientName: "John Doe",
    date: "2024-01-15",
    timestamp: "2024-01-15T10:30:00Z",
    duration: 30,
    stepCount: 45,
    avgCadence: 90,
    sessionNotes: "Normal gait pattern observed with consistent step timing",
    sensorData: generateSensorData(300, new Date("2024-01-15T10:30:00Z")), // 30 seconds at 10Hz
  },
  {
    id: "r2",
    patientId: "1",
    patientName: "John Doe",
    date: "2024-01-10",
    timestamp: "2024-01-10T14:15:00Z",
    duration: 25,
    stepCount: 38,
    avgCadence: 91,
    sessionNotes: "Slightly irregular step pattern, recommend follow-up",
    sensorData: generateSensorData(250, new Date("2024-01-10T14:15:00Z")), // 25 seconds at 10Hz
  },
  {
    id: "r3",
    patientId: "1",
    patientName: "John Doe",
    date: "2024-01-05",
    timestamp: "2024-01-05T16:20:00Z",
    duration: 35,
    stepCount: 52,
    avgCadence: 89,
    sessionNotes: "Excellent gait stability and rhythm",
    sensorData: generateSensorData(350, new Date("2024-01-05T16:20:00Z")), // 35 seconds at 10Hz
  },
  {
    id: "r4",
    patientId: "2",
    patientName: "Jane Smith",
    date: "2024-01-14",
    timestamp: "2024-01-14T09:45:00Z",
    duration: 35,
    stepCount: 52,
    avgCadence: 89,
    sessionNotes: "Strong and consistent gait pattern",
    sensorData: generateSensorData(350, new Date("2024-01-14T09:45:00Z")),
  },
  {
    id: "r5",
    patientId: "2",
    patientName: "Jane Smith",
    date: "2024-01-08",
    timestamp: "2024-01-08T11:30:00Z",
    duration: 28,
    stepCount: 42,
    avgCadence: 90,
    sessionNotes: "Good balance and coordination",
    sensorData: generateSensorData(280, new Date("2024-01-08T11:30:00Z")),
  },
  {
    id: "r6",
    patientId: "3",
    patientName: "Bob Johnson",
    date: "2024-01-13",
    timestamp: "2024-01-13T15:00:00Z",
    duration: 40,
    stepCount: 58,
    avgCadence: 87,
    sessionNotes: "Slower cadence but stable gait",
    sensorData: generateSensorData(400, new Date("2024-01-13T15:00:00Z")),
  },
  {
    id: "r7",
    patientId: "4",
    patientName: "Alice Brown",
    date: "2024-01-12",
    timestamp: "2024-01-12T13:20:00Z",
    duration: 22,
    stepCount: 33,
    avgCadence: 90,
    sessionNotes: "Short session, good performance",
    sensorData: generateSensorData(220, new Date("2024-01-12T13:20:00Z")),
  },
  {
    id: "r8",
    patientId: "5",
    patientName: "Charlie Wilson",
    date: "2024-01-11",
    timestamp: "2024-01-11T08:15:00Z",
    duration: 32,
    stepCount: 48,
    avgCadence: 90,
    sessionNotes: "Consistent performance across session",
    sensorData: generateSensorData(320, new Date("2024-01-11T08:15:00Z")),
  },
]

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  const reading = allReadings.find((r) => r.id === id)

  if (!reading) {
    return NextResponse.json({ success: false, error: "Reading not found" }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    data: reading,
  })
}

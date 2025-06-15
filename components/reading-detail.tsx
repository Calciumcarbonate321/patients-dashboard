"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, User, Activity, BarChart3, Timer, Footprints, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface SensorReading {
  timestamp: string
  accelerometerX: number
  accelerometerY: number
  accelerometerZ: number
  gyroscopeX: number
  gyroscopeY: number
  gyroscopeZ: number
}

interface Reading {
  id: string
  patientId: string
  patientName: string
  date: string
  timestamp: string
  duration: number
  stepCount: number
  avgCadence: number
  sessionNotes?: string
  sensorData: SensorReading[]
}

interface ReadingDetailProps {
  readingId: string
}

export function ReadingDetail({ readingId }: ReadingDetailProps) {
  const [reading, setReading] = useState<Reading | null>(null)
  const [allReadings, setAllReadings] = useState<Reading[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReading() {
      try {
        const response = await fetch(`/api/readings/${readingId}`)
        const result = await response.json()
        if (result.success) {
          setReading(result.data)

          // Fetch all readings for this patient
          const patientResponse = await fetch(`/api/patients/${result.data.patientId}`)
          const patientResult = await patientResponse.json()
          if (patientResult.success) {
            setAllReadings(patientResult.data.readings)
          }
        }
      } catch (error) {
        console.error("Failed to fetch reading:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReading()
  }, [readingId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!reading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="text-center">
            <h3 className="text-xl font-semibold text-gray-800">Reading not found</h3>
            <p className="text-gray-600 mt-2">The requested IMU reading could not be located.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Prepare chart data
  const chartData = reading.sensorData.map((data, index) => ({
    time: index * 0.1, // Assuming 10Hz sampling rate
    accX: data.accelerometerX,
    accY: data.accelerometerY,
    accZ: data.accelerometerZ,
    gyroX: data.gyroscopeX,
    gyroY: data.gyroscopeY,
    gyroZ: data.gyroscopeZ,
  }))

  const summaryStats = [
    {
      label: "Session Duration",
      value: reading.duration,
      unit: "seconds",
      icon: Timer,
    },
    {
      label: "Step Count",
      value: reading.stepCount,
      unit: "steps",
      icon: Footprints,
    },
    {
      label: "Average Cadence",
      value: reading.avgCadence,
      unit: "steps/min",
      icon: Activity,
    },
    {
      label: "Data Points",
      value: reading.sensorData.length,
      unit: "samples",
      icon: BarChart3,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href={`/patients/${reading.patientId}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">IMU Gait Reading</h1>
              <p className="text-gray-600">
                {reading.patientName} • {new Date(reading.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Summary Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {summaryStats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                    <span className="text-sm font-normal text-gray-600 ml-1">{stat.unit}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* IMU Charts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              IMU Sensor Data Visualization
            </CardTitle>
            <CardDescription>
              Real-time accelerometer and gyroscope readings from the gait monitoring session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="accelerometer" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="accelerometer">Accelerometer</TabsTrigger>
                <TabsTrigger value="gyroscope">Gyroscope</TabsTrigger>
              </TabsList>

              <TabsContent value="accelerometer" className="space-y-4">
                <ChartContainer
                  config={{
                    accX: {
                      label: "X-Axis",
                      color: "hsl(var(--chart-1))",
                    },
                    accY: {
                      label: "Y-Axis",
                      color: "hsl(var(--chart-2))",
                    },
                    accZ: {
                      label: "Z-Axis",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" label={{ value: "Time (s)", position: "insideBottom", offset: -5 }} />
                      <YAxis label={{ value: "Acceleration (m/s²)", angle: -90, position: "insideLeft" }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="accX"
                        stroke="#8884d8"
                        name="X-Axis"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="accY"
                        stroke="#82ca9d"
                        name="Y-Axis"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="accZ"
                        stroke="#ffc658"
                        name="Z-Axis"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>

              <TabsContent value="gyroscope" className="space-y-4">
                <ChartContainer
                  config={{
                    gyroX: {
                      label: "X-Axis",
                      color: "hsl(var(--chart-4))",
                    },
                    gyroY: {
                      label: "Y-Axis",
                      color: "hsl(var(--chart-5))",
                    },
                    gyroZ: {
                      label: "Z-Axis",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" label={{ value: "Time (s)", position: "insideBottom", offset: -5 }} />
                      <YAxis label={{ value: "Angular Velocity (rad/s)", angle: -90, position: "insideLeft" }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="gyroX"
                        stroke="#ff7300"
                        name="X-Axis"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="gyroY"
                        stroke="#387908"
                        name="Y-Axis"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="gyroZ"
                        stroke="#003f5c"
                        name="Z-Axis"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Sensor Data Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Raw Sensor Readings
            </CardTitle>
            <CardDescription>Complete 6-axis IMU sensor data with timestamps for this session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Timestamp</TableHead>
                    <TableHead className="text-right">Acc X (m/s²)</TableHead>
                    <TableHead className="text-right">Acc Y (m/s²)</TableHead>
                    <TableHead className="text-right">Acc Z (m/s²)</TableHead>
                    <TableHead className="text-right">Gyro X (rad/s)</TableHead>
                    <TableHead className="text-right">Gyro Y (rad/s)</TableHead>
                    <TableHead className="text-right">Gyro Z (rad/s)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reading.sensorData.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">{data.timestamp}</TableCell>
                      <TableCell className="text-right font-mono">{data.accelerometerX.toFixed(3)}</TableCell>
                      <TableCell className="text-right font-mono">{data.accelerometerY.toFixed(3)}</TableCell>
                      <TableCell className="text-right font-mono">{data.accelerometerZ.toFixed(3)}</TableCell>
                      <TableCell className="text-right font-mono">{data.gyroscopeX.toFixed(3)}</TableCell>
                      <TableCell className="text-right font-mono">{data.gyroscopeY.toFixed(3)}</TableCell>
                      <TableCell className="text-right font-mono">{data.gyroscopeZ.toFixed(3)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Showing {reading.sensorData.length} sensor readings from this session
            </div>
          </CardContent>
        </Card>

        {/* All Patient Readings List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Reading History
            </CardTitle>
            <CardDescription>All IMU gait monitoring sessions for {reading.patientName}</CardDescription>
          </CardHeader>
          <CardContent>
            {allReadings.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600">No readings available</h3>
                <p className="text-gray-500">No IMU gait readings have been recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allReadings.map((r, index) => (
                  <Link key={r.id} href={`/readings/${r.id}`}>
                    <Card
                      className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
                        r.id === reading.id ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <Badge variant={r.id === reading.id ? "default" : "secondary"}>
                                Session #{allReadings.length - index}
                              </Badge>
                              <div className="flex items-center gap-2 text-sm font-medium">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                {new Date(r.date).toLocaleDateString()}
                              </div>
                              {r.id === reading.id && (
                                <Badge variant="outline" className="text-blue-600 border-blue-300">
                                  Current
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <span>
                                Duration: <strong>{r.duration}s</strong>
                              </span>
                              <span>
                                Steps: <strong>{r.stepCount}</strong>
                              </span>
                              <span>
                                Cadence: <strong>{r.avgCadence}/min</strong>
                              </span>
                              <span>
                                Samples: <strong>{r.sensorData?.length || 0}</strong>
                              </span>
                            </div>
                          </div>
                          <Button variant={r.id === reading.id ? "default" : "outline"} size="sm">
                            {r.id === reading.id ? "Current Session" : "View Analysis"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Session Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Session Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="font-medium text-gray-900">{reading.patientName}</p>
                <p className="text-sm text-gray-600">Patient ID: {reading.patientId}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Session Date & Time</p>
                <p className="text-sm text-gray-600">{new Date(reading.timestamp).toLocaleString()}</p>
              </div>
            </div>

            {reading.sessionNotes && (
              <div>
                <p className="font-medium text-gray-900 mb-2">Session Notes</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{reading.sessionNotes}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button variant="outline" asChild>
                <Link href={`/patients/${reading.patientId}`}>View Patient Profile</Link>
              </Button>
              <Badge variant="secondary" className="px-3 py-1">
                Reading ID: {reading.id}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

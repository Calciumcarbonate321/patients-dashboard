"use client"

import { useState, useEffect } from "react"
import { Activity, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  url: string // URL to the CSV file
}

interface ReadingDetailProps {
  readingId: string
}

interface ParsedCsvRow {
  accelerometerX: string
  accelerometerY: string
  accelerometerZ: string
  gyroscopeX: string
  gyroscopeY: string
  gyroscopeZ: string
  timestamp?: string
}

export function ReadingDetail({ readingId }: ReadingDetailProps) {
  const [reading, setReading] = useState<Reading | null>(null)
  const [imuData, setImuData] = useState<SensorReading[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReading() {
      try {
        const response = await fetch(`/api/readings/${readingId}`)
        const result = await response.json()
        setReading(result)
        console.log(result)
        if (result.success) {
          // Fetch and parse CSV if url exists
          if (result.url) {
            const csvRes = await fetch(result.url)
            const csvText = await csvRes.text()
            // Provide correct headers since CSV has no header row
            const headers = [
              'accelerometerX',
              'accelerometerY',
              'accelerometerZ',
              'gyroscopeX',
              'gyroscopeY',
              'gyroscopeZ',
            ]
            const lines = csvText.trim().split(/\r?\n/)
            if (lines.length > 0) {
              console.log('First CSV Row:', lines[0])
            }
            const data = lines.map(line => {
              const values = line.split(',')
              const obj: ParsedCsvRow = {
                accelerometerX: values[0]?.trim() ?? '',
                accelerometerY: values[1]?.trim() ?? '',
                accelerometerZ: values[2]?.trim() ?? '',
                gyroscopeX: values[3]?.trim() ?? '',
                gyroscopeY: values[4]?.trim() ?? '',
                gyroscopeZ: values[5]?.trim() ?? '',
                // timestamp will be added below
              }
              // Convert numeric fields
              obj.accelerometerX = parseFloat(obj.accelerometerX).toString()
              obj.accelerometerY = parseFloat(obj.accelerometerY).toString()
              obj.accelerometerZ = parseFloat(obj.accelerometerZ).toString()
              obj.gyroscopeX = parseFloat(obj.gyroscopeX).toString() 
              obj.gyroscopeY = parseFloat(obj.gyroscopeY).toString()
              obj.gyroscopeZ = parseFloat(obj.gyroscopeZ).toString()
              // Add a fake timestamp (index-based) if needed
              obj.timestamp = String(new Date(Date.now() + lines.indexOf(line) * 100).toISOString())
              return obj as unknown as SensorReading
            })
            console.log("Parsed IMU Data:", data)
            setImuData(data)
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
  const chartData = imuData.map((data, index) => ({
    time: index * 0.1, // Assuming 10Hz sampling rate
    accX: data.accelerometerX,
    accY: data.accelerometerY,
    accZ: data.accelerometerZ,
    gyroX: data.gyroscopeX,
    gyroY: data.gyroscopeY,
    gyroZ: data.gyroscopeZ,
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8 space-y-8">
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
            <div className="w-full overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Legend */}
                <div className="flex gap-6 mb-4 flex-wrap">
                  <div className="flex items-center gap-2"><span className="inline-block w-4 h-1 rounded bg-[#ff0000]"></span>Acc X</div>
                  <div className="flex items-center gap-2"><span className="inline-block w-4 h-1 rounded bg-[#00b894]"></span>Acc Y</div>
                  <div className="flex items-center gap-2"><span className="inline-block w-4 h-1 rounded bg-[#0984e3]"></span>Acc Z</div>
                  <div className="flex items-center gap-2"><span className="inline-block w-4 h-1 rounded bg-[#fdcb6e]"></span>Gyro X</div>
                  <div className="flex items-center gap-2"><span className="inline-block w-4 h-1 rounded bg-[#6c5ce7]"></span>Gyro Y</div>
                  <div className="flex items-center gap-2"><span className="inline-block w-4 h-1 rounded bg-[#636e72]"></span>Gyro Z</div>
                </div>
                <Tabs defaultValue="accelerometer" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="accelerometer">Accelerometer</TabsTrigger>
                    <TabsTrigger value="gyroscope">Gyroscope</TabsTrigger>
                  </TabsList>
                  <TabsContent value="accelerometer" className="space-y-4">
                    <ChartContainer
                      config={{
                        accX: { label: "X-Axis", color: "#ff0000" },
                        accY: { label: "Y-Axis", color: "#00b894" },
                        accZ: { label: "Z-Axis", color: "#0984e3" },
                      }}
                      className="h-[400px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" label={{ value: "Time (s)", position: "insideBottom", offset: -5 }} />
                          <YAxis label={{ value: "Acceleration (m/s²)", angle: -90, position: "insideLeft" }} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line type="monotone" dataKey="accX" stroke="#ff0000" name="X-Axis" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="accY" stroke="#00b894" name="Y-Axis" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="accZ" stroke="#0984e3" name="Z-Axis" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </TabsContent>
                  <TabsContent value="gyroscope" className="space-y-4">
                    <ChartContainer
                      config={{
                        gyroX: { label: "X-Axis", color: "#fdcb6e" },
                        gyroY: { label: "Y-Axis", color: "#6c5ce7" },
                        gyroZ: { label: "Z-Axis", color: "#636e72" },
                      }}
                      className="h-[400px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" label={{ value: "Time (s)", position: "insideBottom", offset: -5 }} />
                          <YAxis label={{ value: "Angular Velocity (rad/s)", angle: -90, position: "insideLeft" }} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line type="monotone" dataKey="gyroX" stroke="#fdcb6e" name="X-Axis" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="gyroY" stroke="#6c5ce7" name="Y-Axis" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="gyroZ" stroke="#636e72" name="Z-Axis" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
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
                  {imuData.map((data, index) => (
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
              Showing {imuData.length} sensor readings from this session
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

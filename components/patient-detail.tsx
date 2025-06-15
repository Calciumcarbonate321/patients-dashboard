"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, User, Mail, Phone, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Patient {
  id: string
  name: string
  age: number
  email: string
  phone: string
}

interface Reading {
  id: string
  patientId: string
  date: string
  duration: number
  stepCount: number
  avgCadence: number
  sensorData: any[]
}

interface PatientDetailProps {
  patientId: string
}

export function PatientDetail({ patientId }: PatientDetailProps) {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [readings, setReadings] = useState<Reading[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPatientData() {
      try {
        const response = await fetch(`/api/patients/${patientId}`)
        const result = await response.json()
        if (result.success) {
          setPatient(result.data.patient)
          setReadings(result.data.readings)
        }
      } catch (error) {
        console.error("Failed to fetch patient data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPatientData()
  }, [patientId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="text-center">
            <h3 className="text-xl font-semibold text-gray-800">Patient not found</h3>
            <p className="text-gray-600 mt-2">The requested patient could not be located in our system.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <User className="h-6 w-6" />
                {patient.name}
              </h1>
              <p className="text-gray-600">Patient ID: {patient.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Age:</span>
              <span>{patient.age} years</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Email:</span>
              <span>{patient.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Phone:</span>
              <span>{patient.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Total Readings:</span>
              <Badge variant="secondary">{readings.length}</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Gait Monitor Readings</h2>
          {readings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Activity className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold">No readings found</h3>
                <p className="text-gray-600">No IMU gait readings have been recorded for this patient yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {readings.map((reading) => (
                <Link key={reading.id} href={`/readings/${reading.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{new Date(reading.date).toLocaleDateString()}</span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <span>Duration: {reading.duration}s</span>
                            <span>Steps: {reading.stepCount}</span>
                            <span>Cadence: {reading.avgCadence}/min</span>
                            <span>Samples: {reading.sensorData?.length || 0}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Analysis
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

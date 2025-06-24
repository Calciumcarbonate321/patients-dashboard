"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Patient {
  id: string
  name: string
  readings_count: number
  created_at: string
}

export function PatientDashboard() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch("/api/patients")
        const result = await response.json()
        if (result.success) {
          setPatients(result.data)
        }
      } catch (error) {
        console.error("Failed to fetch patients:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage and monitor patient health records</p>
            </div>
            <Button asChild>
              <Link href="/add-patient">
                <Plus className="mr-2 h-4 w-4" />
                Add Patient
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {patients.map((patient) => (
            <Link key={patient.id} href={`/patients/${patient.id}`} className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer relative group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {patient.name}
                    </CardTitle>
                    <Badge variant="secondary">{patient.readings_count} sessions</Badge>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Patient ID: {patient.id}</div>
                </CardHeader>
                <CardContent className="space-y-2 relative min-h-[48px] pb-10">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="fixed-card-delete transition-transform duration-150 hover:scale-105 hover:shadow-lg cursor-pointer"
                    style={{ position: 'absolute', right: '1rem', bottom: '1rem', zIndex: 10 }}
                    onClick={async (e) => {
                      e.preventDefault();
                      if (confirm(`Are you sure you want to delete patient '${patient.name}'?`)) {
                        setLoading(true);
                        try {
                          const res = await fetch(`/api/patients/${patient.id}`, { method: 'DELETE' });
                          const result = await res.json();
                          if (result.success) {
                            setPatients((prev) => prev.filter((p) => p.id !== patient.id));
                          } else {
                            alert(result.error || 'Failed to delete patient.');
                          }
                        } catch (err) {
                          alert('Failed to delete patient.');
                        } finally {
                          setLoading(false);
                        }
                      }
                    }}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {patients.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold">No patients found</h3>
            <p className="text-gray-600">Get started by adding your first patient to monitor their gait patterns.</p>
            <Button asChild className="mt-4">
              <Link href="/add-patient">
                <Plus className="mr-2 h-4 w-4" />
                Add Patient
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

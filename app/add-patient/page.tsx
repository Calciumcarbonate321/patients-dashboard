import { AddPatientForm } from "@/components/add-patient-form"

export default function AddPatientPage() {
  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Add New Patient</h1>
          <p className="text-muted-foreground">Enter patient information to create a new record.</p>
        </div>
        <AddPatientForm />
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import AddChildForm from "@/components/forms/AddChildForm"
import DashboardSections from "@/components/dashboard/parentSection";


export default function ParentDashboard() {
  const [view, setView] = useState<"dashboard" | "add-child">("dashboard")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">Parent Dashboard</h1>
            <p className="text-gray-600">Monitor your children&#39;s learning progress</p>
          </div>
          {view === "dashboard" && (
            <button
              onClick={() => setView("add-child")}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Child
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {view === "dashboard" ? (
          <DashboardSections /> 
        ) : (
          <AddChildForm onBack={() => setView("dashboard")} />
        )}
      </div>
    </div>
  )
}

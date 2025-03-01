"use client"

import { useEffect, useState } from "react"
import { Calendar, PenToolIcon as Tool, CheckCircle, XCircle } from "lucide-react"

interface MaintenanceTask {
  id: string
  description: string
  date: string
  status: "PLANIFIEE" | "EN_COURS" | "TERMINEE" | "ANNULEE"
}

export default function Maintenance() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([])

  useEffect(() => {
    // Simuler le chargement des tâches de maintenance
    setTasks([
      {
        id: "TASK001",
        description: "Nettoyage des filtres sur CAPTEUR001",
        date: "2023-07-20T09:00:00Z",
        status: "PLANIFIEE",
      },
      {
        id: "TASK002",
        description: "Remplacement de la batterie sur CAPTEUR002",
        date: "2023-07-18T14:30:00Z",
        status: "EN_COURS",
      },
      {
        id: "TASK003",
        description: "Calibration de CAPTEUR003",
        date: "2023-07-15T10:00:00Z",
        status: "TERMINEE",
      },
      {
        id: "TASK004",
        description: "Mise à jour du firmware sur CAPTEUR004",
        date: "2023-07-22T11:00:00Z",
        status: "PLANIFIEE",
      },
    ])
  }, [])

  const getStatusIcon = (status: MaintenanceTask["status"]) => {
    switch (status) {
      case "PLANIFIEE":
        return <Calendar className="h-6 w-6 text-blue-500" />
      case "EN_COURS":
        return <Tool className="h-6 w-6 text-yellow-500" />
      case "TERMINEE":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "ANNULEE":
        return <XCircle className="h-6 w-6 text-red-500" />
    }
  }

  const getStatusColor = (status: MaintenanceTask["status"]) => {
    switch (status) {
      case "PLANIFIEE":
        return "bg-blue-100 text-blue-800"
      case "EN_COURS":
        return "bg-yellow-100 text-yellow-800"
      case "TERMINEE":
        return "bg-green-100 text-green-800"
      case "ANNULEE":
        return "bg-red-100 text-red-800"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Maintenance</h1>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className={`flex items-center p-4 rounded-lg ${getStatusColor(task.status)}`}>
            {getStatusIcon(task.status)}
            <div className="ml-3">
              <p className="font-semibold">{task.description}</p>
              <p className="text-sm">{new Date(task.date).toLocaleString()}</p>
            </div>
            <span
              className="ml-auto px-2 py-1 text-xs font-semibold rounded-full bg-opacity-50"
              style={{ backgroundColor: `var(--${getStatusColor(task.status).split(" ")[0].slice(3)})` }}
            >
              {task.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}


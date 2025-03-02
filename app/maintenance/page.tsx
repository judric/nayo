"use client"

import { useEffect, useState } from "react"
import { Calendar, PenToolIcon as Tool, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import io from "socket.io-client"

interface MaintenanceTask {
  id: string
  description: string
  date: string
  status: "PLANIFIEE" | "EN_COURS" | "TERMINEE" | "ANNULEE"
  pompeId: string
}

interface PompeStatus {
  id: string
  nom: string
  etat: "NORMAL" | "ATTENTION" | "CRITIQUE"
  derniereMaintenance: string
}

export default function Maintenance() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([])
  const [pompes, setPompes] = useState<PompeStatus[]>([])

  useEffect(() => {
    const socket = io("http://localhost:3001")

    socket.on("maintenanceUpdate", (data: { tasks: MaintenanceTask[]; pompes: PompeStatus[] }) => {
      setTasks(data.tasks)
      setPompes(data.pompes)
    })

    return () => {
      socket.disconnect()
    }
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

  const getPompeStatusIcon = (etat: PompeStatus["etat"]) => {
    switch (etat) {
      case "NORMAL":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "ATTENTION":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />
      case "CRITIQUE":
        return <XCircle className="h-6 w-6 text-red-500" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-nayo-700">Maintenance</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">État des Pompes</h2>
          {pompes.map((pompe) => (
            <div key={pompe.id} className="flex items-center justify-between mb-4 p-4 bg-gray-100 rounded-lg">
              <div>
                <p className="font-semibold">{pompe.nom}</p>
                <p className="text-sm text-gray-600">
                  Dernière maintenance: {new Date(pompe.derniereMaintenance).toLocaleDateString()}
                </p>
              </div>
              {getPompeStatusIcon(pompe.etat)}
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Tâches de Maintenance</h2>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className={`flex items-center p-4 rounded-lg ${getStatusColor(task.status)}`}>
                {getStatusIcon(task.status)}
                <div className="ml-3">
                  <p className="font-semibold">{task.description}</p>
                  <p className="text-sm">{new Date(task.date).toLocaleString()}</p>
                  <p className="text-xs mt-1">Pompe: {task.pompeId}</p>
                </div>
                <span className={`ml-auto px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


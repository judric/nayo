"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, AlertCircle, AlertOctagon } from "lucide-react"
import io from "socket.io-client"

interface Alerte {
  id: string
  type: string
  message: string
  niveau: "BASSE" | "MOYENNE" | "HAUTE" | "CRITIQUE"
  dateCreation: string
  capteurId: string
  pompeId: string
}

export default function Alertes() {
  const [alertes, setAlertes] = useState<Alerte[]>([])

  useEffect(() => {
    const socket = io("http://localhost:3001")

    socket.on("nouvelleAlerte", (alerte: Alerte) => {
      setAlertes((prev) => [alerte, ...prev])
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const getAlertIcon = (niveau: Alerte["niveau"]) => {
    switch (niveau) {
      case "BASSE":
        return <AlertCircle className="h-6 w-6 text-blue-500" />
      case "MOYENNE":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />
      case "HAUTE":
        return <AlertTriangle className="h-6 w-6 text-orange-500" />
      case "CRITIQUE":
        return <AlertOctagon className="h-6 w-6 text-red-500" />
    }
  }

  const getAlertColor = (niveau: Alerte["niveau"]) => {
    switch (niveau) {
      case "BASSE":
        return "bg-blue-100 text-blue-800"
      case "MOYENNE":
        return "bg-yellow-100 text-yellow-800"
      case "HAUTE":
        return "bg-orange-100 text-orange-800"
      case "CRITIQUE":
        return "bg-red-100 text-red-800"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-nayo-700">Alertes</h1>

      <div className="space-y-4">
        {alertes.map((alerte) => (
          <div
            key={alerte.id}
            className={`flex items-center p-4 rounded-lg ${getAlertColor(alerte.niveau)} transition-all duration-300 hover:shadow-md`}
          >
            {getAlertIcon(alerte.niveau)}
            <div className="ml-3 flex-grow">
              <p className="font-semibold">{alerte.type}</p>
              <p className="text-sm">{alerte.message}</p>
              <p className="text-xs mt-1">{new Date(alerte.dateCreation).toLocaleString()}</p>
            </div>
            <div className="ml-auto">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getAlertColor(alerte.niveau)}`}>
                {alerte.niveau}
              </span>
            </div>
            <div className="ml-4 text-right">
              <p className="text-xs">Pompe: {alerte.pompeId}</p>
              <p className="text-xs">Capteur: {alerte.capteurId}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


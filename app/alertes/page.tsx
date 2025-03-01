"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, AlertCircle, AlertOctagon } from "lucide-react"

interface Alerte {
  id: string
  type: string
  message: string
  niveau: "BASSE" | "MOYENNE" | "HAUTE" | "CRITIQUE"
  dateCreation: string
}

export default function Alertes() {
  const [alertes, setAlertes] = useState<Alerte[]>([])

  useEffect(() => {
    // Simuler le chargement des alertes
    setAlertes([
      {
        id: "ALERTE001",
        type: "DEPASSEMENT_SEUIL",
        message: "Niveau d'eau élevé sur CAPTEUR001",
        niveau: "HAUTE",
        dateCreation: "2023-07-15T10:30:00Z",
      },
      {
        id: "ALERTE002",
        type: "BATTERIE_FAIBLE",
        message: "Batterie faible sur CAPTEUR002",
        niveau: "MOYENNE",
        dateCreation: "2023-07-15T09:45:00Z",
      },
      {
        id: "ALERTE003",
        type: "PANNE_CAPTEUR",
        message: "CAPTEUR003 ne répond pas",
        niveau: "CRITIQUE",
        dateCreation: "2023-07-15T08:15:00Z",
      },
    ])
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
      <h1 className="text-3xl font-bold mb-6">Alertes</h1>

      <div className="space-y-4">
        {alertes.map((alerte) => (
          <div key={alerte.id} className={`flex items-center p-4 rounded-lg ${getAlertColor(alerte.niveau)}`}>
            {getAlertIcon(alerte.niveau)}
            <div className="ml-3">
              <p className="font-semibold">{alerte.type}</p>
              <p className="text-sm">{alerte.message}</p>
              <p className="text-xs mt-1">{new Date(alerte.dateCreation).toLocaleString()}</p>
            </div>
            <span
              className="ml-auto px-2 py-1 text-xs font-semibold rounded-full bg-opacity-50"
              style={{ backgroundColor: `var(--${getAlertColor(alerte.niveau).split(" ")[0].slice(3)})` }}
            >
              {alerte.niveau}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}


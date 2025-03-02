"use client"

import { useEffect, useState } from "react"
import { Droplet, Thermometer, Activity, AlertTriangle } from "lucide-react"
import io from "socket.io-client"

interface Capteur {
  idAppareil: string
  type: string
  localisation: {
    latitude: number
    longitude: number
  }
  derniereMesure: {
    date: string
    valeur: number
    unite: string
  }
  estActif: boolean
  pompeId: string
}

export default function Capteurs() {
  const [capteurs, setCapteurs] = useState<Capteur[]>([])

  useEffect(() => {
    const socket = io("http://localhost:3001")

    socket.on("capteurUpdate", (data: Capteur) => {
      setCapteurs((prev) => {
        const index = prev.findIndex((c) => c.idAppareil === data.idAppareil)
        if (index !== -1) {
          const newCapteurs = [...prev]
          newCapteurs[index] = data
          return newCapteurs
        } else {
          return [...prev, data]
        }
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case "NIVEAU_EAU":
        return <Droplet className="h-8 w-8 text-blue-500" />
      case "PRESSION":
        return <AlertTriangle className="h-8 w-8 text-yellow-500" />
      case "DEBIT":
        return <Activity className="h-8 w-8 text-green-500" />
      default:
        return <Thermometer className="h-8 w-8 text-red-500" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-nayo-700">Capteurs</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {capteurs.map((capteur) => (
          <div
            key={capteur.idAppareil}
            className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center mb-4">
              {getIcon(capteur.type)}
              <h2 className="text-xl font-semibold ml-3">{capteur.type}</h2>
            </div>
            <p className="text-gray-600 mb-2">ID: {capteur.idAppareil}</p>
            <p className="text-gray-600 mb-2">Pompe: {capteur.pompeId}</p>
            <p className="text-gray-600 mb-2">
              Localisation: {capteur.localisation.latitude.toFixed(4)}, {capteur.localisation.longitude.toFixed(4)}
            </p>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Dernière mesure:</p>
              <p className="text-2xl font-bold">
                {capteur.derniereMesure.valeur.toFixed(2)} {capteur.derniereMesure.unite}
              </p>
              <p className="text-sm text-gray-500">{new Date(capteur.derniereMesure.date).toLocaleString()}</p>
            </div>
            <div className="mt-4">
              <p className={`text-sm ${capteur.estActif ? "text-green-500" : "text-red-500"}`}>
                {capteur.estActif ? "Actif" : "Inactif"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


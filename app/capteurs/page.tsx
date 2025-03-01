"use client"

import { useEffect, useState } from "react"
import { Droplet, Battery, Thermometer } from "lucide-react"

interface Capteur {
  id: string
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
}

export default function Capteurs() {
  const [capteurs, setCapteurs] = useState<Capteur[]>([])

  useEffect(() => {
    // Simuler le chargement des données des capteurs
    setCapteurs([
      {
        id: "CAPTEUR001",
        type: "NIVEAU_EAU",
        localisation: { latitude: 48.8566, longitude: 2.3522 },
        derniereMesure: { date: "2023-07-15T10:30:00Z", valeur: 75, unite: "%" },
      },
      {
        id: "CAPTEUR002",
        type: "PRESSION",
        localisation: { latitude: 45.764, longitude: 4.8357 },
        derniereMesure: { date: "2023-07-15T10:35:00Z", valeur: 5.2, unite: "bar" },
      },
      {
        id: "CAPTEUR003",
        type: "DEBIT",
        localisation: { latitude: 43.2965, longitude: 5.3698 },
        derniereMesure: { date: "2023-07-15T10:40:00Z", valeur: 320, unite: "L/min" },
      },
    ])
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case "NIVEAU_EAU":
        return <Droplet className="h-8 w-8 text-blue-500" />
      case "PRESSION":
        return <Battery className="h-8 w-8 text-green-500" />
      case "DEBIT":
        return <Thermometer className="h-8 w-8 text-red-500" />
      default:
        return <Droplet className="h-8 w-8 text-gray-500" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Capteurs</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {capteurs.map((capteur) => (
          <div key={capteur.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              {getIcon(capteur.type)}
              <h2 className="text-xl font-semibold ml-3">{capteur.type}</h2>
            </div>
            <p className="text-gray-600 mb-2">ID: {capteur.id}</p>
            <p className="text-gray-600 mb-2">
              Localisation: {capteur.localisation.latitude.toFixed(4)}, {capteur.localisation.longitude.toFixed(4)}
            </p>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Dernière mesure:</p>
              <p className="text-2xl font-bold">
                {capteur.derniereMesure.valeur} {capteur.derniereMesure.unite}
              </p>
              <p className="text-sm text-gray-500">{new Date(capteur.derniereMesure.date).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


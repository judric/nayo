"use client"

import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { AlertTriangle, Droplet } from "lucide-react"
import MapComponent from "@/components/MapComponent"
import io from "socket.io-client"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface CapteurData {
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

interface AlerteData {
  id: string
  type: string
  message: string
  niveau: string
}

export default function TableauDeBord() {
  const [capteurs, setCapteurs] = useState<CapteurData[]>([])
  const [alertes, setAlertes] = useState<AlerteData[]>([])
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Niveau d'eau",
        data: [],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  })

  useEffect(() => {
    const socket = io("http://localhost:3001")

    socket.on("capteurUpdate", (data: CapteurData) => {
      setCapteurs((prev) => {
        const index = prev.findIndex((c) => c.id === data.id)
        if (index !== -1) {
          const newCapteurs = [...prev]
          newCapteurs[index] = data
          return newCapteurs
        }
        return [...prev, data]
      })

      setChartData((prev) => {
        const newLabels = [...prev.labels, new Date().toLocaleTimeString()]
        const newData = [...prev.datasets[0].data, data.derniereMesure.valeur]
        if (newLabels.length > 10) {
          newLabels.shift()
          newData.shift()
        }
        return {
          labels: newLabels,
          datasets: [{ ...prev.datasets[0], data: newData }],
        }
      })
    })

    socket.on("alerteUpdate", (data: AlerteData) => {
      setAlertes((prev) => [...prev, data])
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-nayo-700">Tableau de Bord NAYO</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {capteurs.map((capteur) => (
          <div key={capteur.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">{capteur.type}</h2>
            <div className="flex items-center justify-between">
              <Droplet className="h-12 w-12 text-nayo-500" />
              <div className="text-right">
                <p className="text-3xl font-bold">{capteur.derniereMesure.valeur}</p>
                <p className="text-gray-500">{capteur.derniereMesure.unite}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Carte des Capteurs</h2>
          <MapComponent capteurs={capteurs} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Niveau d'Eau en Temps Réel</h2>
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Alertes récentes</h2>
        <div className="space-y-4">
          {alertes.map((alerte) => (
            <div key={alerte.id} className="flex items-center p-4 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
              <div>
                <p className="font-semibold">{alerte.type}</p>
                <p className="text-sm text-gray-600">{alerte.message}</p>
              </div>
              <span className="ml-auto px-2 py-1 bg-red-200 text-red-800 text-xs font-semibold rounded-full">
                {alerte.niveau}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


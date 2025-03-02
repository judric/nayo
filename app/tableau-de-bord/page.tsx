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
import { AlertTriangle, Droplet, Activity, CheckCircle, XCircle } from "lucide-react"
import dynamic from "next/dynamic"
import io from "socket.io-client"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false })

interface CapteurData {
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

interface PompeData {
  id: string
  nom: string
  capteurs: CapteurData[]
}

export default function TableauDeBord() {
  const [pompes, setPompes] = useState<PompeData[]>([])
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Niveau d'eau - Pompe Bouaké",
        data: [],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Niveau d'eau - Pompe Korhogo",
        data: [],
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  })

  useEffect(() => {
    const socket = io("http://localhost:5000")

    socket.on("capteurUpdate", (data: CapteurData) => {
      setPompes((prev) => {
        const newPompes = [...prev]
        const pompeIndex = newPompes.findIndex((p) => p.id === data.pompeId)
        if (pompeIndex !== -1) {
          const capteurIndex = newPompes[pompeIndex].capteurs.findIndex((c) => c.idAppareil === data.idAppareil)
          if (capteurIndex !== -1) {
            newPompes[pompeIndex].capteurs[capteurIndex] = data
          } else {
            newPompes[pompeIndex].capteurs.push(data)
          }
        } else {
          newPompes.push({ id: data.pompeId, nom: `Pompe ${data.pompeId}`, capteurs: [data] })
        }
        return newPompes
      })

      if (data.type === "NIVEAU_EAU") {
        setChartData((prev) => {
          const newLabels = [...prev.labels, new Date().toLocaleTimeString()]
          const newData1 = [...prev.datasets[0].data]
          const newData2 = [...prev.datasets[1].data]

          if (data.pompeId === "POMPE001") {
            newData1.push(data.derniereMesure.valeur)
          } else if (data.pompeId === "POMPE002") {
            newData2.push(data.derniereMesure.valeur)
          }

          if (newLabels.length > 20) {
            newLabels.shift()
            newData1.shift()
            newData2.shift()
          }

          return {
            labels: newLabels,
            datasets: [
              { ...prev.datasets[0], data: newData1 },
              { ...prev.datasets[1], data: newData2 },
            ],
          }
        })
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-nayo-700">Tableau de Bord NAYO</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Carte des Pompes</h2>
          <MapComponent pompes={pompes} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Niveau d'Eau en Temps Réel</h2>
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      {pompes.map((pompe) => (
        <div
          key={pompe.id}
          className="mb-8 bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-4">{pompe.nom}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pompe.capteurs.map((capteur) => (
              <div
                key={capteur.idAppareil}
                className="bg-nayo-100 p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">{capteur.type}</h3>
                  {capteur.estActif ? (
                    <CheckCircle className="h-6 w-6 text-green-500 animate-pulse" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500 animate-pulse" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  {capteur.type === "NIVEAU_EAU" && <Droplet className="h-12 w-12 text-nayo-500 wave-animation" />}
                  {capteur.type === "DEBIT" && <Activity className="h-12 w-12 text-nayo-500 animate-pulse" />}
                  {capteur.type === "PRESSION" && <AlertTriangle className="h-12 w-12 text-nayo-500 animate-pulse" />}
                  <div className="text-right">
                    <p className="text-3xl font-bold">{capteur.derniereMesure.valeur.toFixed(2)}</p>
                    <p className="text-gray-500">{capteur.derniereMesure.unite}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Dernière mise à jour: {new Date(capteur.derniereMesure.date).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}


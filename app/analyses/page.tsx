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
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import io from "socket.io-client"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface AnalysisData {
  date: string
  niveauEau: number
  pression: number
  debit: number
  pompeId: string
}

interface AggregatedData {
  niveauEauMoyen: number
  pressionMoyenne: number
  debitMoyen: number
}

export default function Analyses() {
  const [data, setData] = useState<AnalysisData[]>([])
  const [aggregatedData, setAggregatedData] = useState<AggregatedData>({
    niveauEauMoyen: 0,
    pressionMoyenne: 0,
    debitMoyen: 0,
  })

  useEffect(() => {
    const socket = io("http://localhost:3001")

    socket.on("analyseUpdate", (newData: AnalysisData) => {
      setData((prev) => {
        const updatedData = [...prev, newData].slice(-30) // Keep only last 30 data points
        updateAggregatedData(updatedData)
        return updatedData
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const updateAggregatedData = (data: AnalysisData[]) => {
    const aggregated = data.reduce(
      (acc, curr) => {
        acc.niveauEauMoyen += curr.niveauEau
        acc.pressionMoyenne += curr.pression
        acc.debitMoyen += curr.debit
        return acc
      },
      { niveauEauMoyen: 0, pressionMoyenne: 0, debitMoyen: 0 },
    )

    const count = data.length
    setAggregatedData({
      niveauEauMoyen: aggregated.niveauEauMoyen / count,
      pressionMoyenne: aggregated.pressionMoyenne / count,
      debitMoyen: aggregated.debitMoyen / count,
    })
  }

  const chartData = {
    labels: data.map((d) => new Date(d.date).toLocaleTimeString()),
    datasets: [
      {
        label: "Niveau d'eau",
        data: data.map((d) => d.niveauEau),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Pression",
        data: data.map((d) => d.pression),
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      {
        label: "Débit",
        data: data.map((d) => d.debit),
        borderColor: "rgb(54, 162, 235)",
        tension: 0.1,
      },
    ],
  }

  const getAverageTrend = (current: number, average: number) => {
    if (current > average) {
      return <TrendingUp className="h-6 w-6 text-green-500" />
    } else if (current < average) {
      return <TrendingDown className="h-6 w-6 text-red-500" />
    } else {
      return <AlertTriangle className="h-6 w-6 text-yellow-500" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-nayo-700">Analyses</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Tendances en Temps Réel</h2>
        <div style={{ height: "400px" }}>
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Niveau d'eau moyen</h3>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold">{aggregatedData.niveauEauMoyen.toFixed(2)}%</p>
            {getAverageTrend(data[data.length - 1]?.niveauEau || 0, aggregatedData.niveauEauMoyen)}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Pression moyenne</h3>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold">{aggregatedData.pressionMoyenne.toFixed(2)} bar</p>
            {getAverageTrend(data[data.length - 1]?.pression || 0, aggregatedData.pressionMoyenne)}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Débit moyen</h3>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold">{aggregatedData.debitMoyen.toFixed(2)} L/min</p>
            {getAverageTrend(data[data.length - 1]?.debit || 0, aggregatedData.debitMoyen)}
          </div>
        </div>
      </div>
    </div>
  )
}


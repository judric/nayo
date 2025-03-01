"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"

interface AnalysisData {
  date: string
  niveauEau: number
  pression: number
  debit: number
}

export default function Analyses() {
  const [data, setData] = useState<AnalysisData[]>([])

  useEffect(() => {
    // Simuler le chargement des données d'analyse
    const generateData = () => {
      const data: AnalysisData[] = []
      const now = new Date()
      for (let i = 30; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        data.push({
          date: date.toISOString().split("T")[0],
          niveauEau: Math.random() * 100,
          pression: Math.random() * 10,
          debit: Math.random() * 500,
        })
      }
      return data
    }

    setData(generateData())
  }, [])

  const getAverageTrend = (data: number[]) => {
    const average = data.reduce((sum, value) => sum + value, 0) / data.length
    const lastValue = data[data.length - 1]
    if (lastValue > average) {
      return <TrendingUp className="h-6 w-6 text-green-500" />
    } else if (lastValue < average) {
      return <TrendingDown className="h-6 w-6 text-red-500" />
    } else {
      return <AlertTriangle className="h-6 w-6 text-yellow-500" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Analyses</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Tendances sur 30 jours</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="niveauEau" stroke="#3B82F6" name="Niveau d'eau (%)" />
            <Line yAxisId="left" type="monotone" dataKey="pression" stroke="#10B981" name="Pression (bar)" />
            <Line yAxisId="right" type="monotone" dataKey="debit" stroke="#EF4444" name="Débit (L/min)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Niveau d'eau moyen</h3>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold">{data.length > 0 ? data[data.length - 1].niveauEau.toFixed(2) : 0}%</p>
            {getAverageTrend(data.map((d) => d.niveauEau))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Pression moyenne</h3>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold">{data.length > 0 ? data[data.length - 1].pression.toFixed(2) : 0} bar</p>
            {getAverageTrend(data.map((d) => d.pression))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Débit moyen</h3>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold">{data.length > 0 ? data[data.length - 1].debit.toFixed(2) : 0} L/min</p>
            {getAverageTrend(data.map((d) => d.debit))}
          </div>
        </div>
      </div>
    </div>
  )
}


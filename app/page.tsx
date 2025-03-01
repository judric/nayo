import Link from "next/link"
import { Droplet, Activity, AlertTriangle, BarChart2, Settings } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Système de Surveillance de l'Eau NAYO</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/tableau-de-bord"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <BarChart2 className="h-8 w-8 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold">Tableau de Bord</h2>
          </div>
          <p className="text-gray-600">
            Visualisez en temps réel l'état de vos installations et les données des capteurs.
          </p>
        </Link>

        <Link href="/capteurs" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <Droplet className="h-8 w-8 text-green-500 mr-3" />
            <h2 className="text-xl font-semibold">Capteurs</h2>
          </div>
          <p className="text-gray-600">Gérez et surveillez l'ensemble de vos capteurs et stations de pompage.</p>
        </Link>

        <Link href="/alertes" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
            <h2 className="text-xl font-semibold">Alertes</h2>
          </div>
          <p className="text-gray-600">Recevez et gérez les alertes en temps réel pour une intervention rapide.</p>
        </Link>

        <Link href="/maintenance" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <Settings className="h-8 w-8 text-yellow-500 mr-3" />
            <h2 className="text-xl font-semibold">Maintenance</h2>
          </div>
          <p className="text-gray-600">Planifiez et suivez les opérations de maintenance préventive et corrective.</p>
        </Link>

        <Link href="/analyses" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <Activity className="h-8 w-8 text-purple-500 mr-3" />
            <h2 className="text-xl font-semibold">Analyses</h2>
          </div>
          <p className="text-gray-600">Accédez à des analyses détaillées et des prévisions basées sur l'IA.</p>
        </Link>
      </div>
    </div>
  )
}


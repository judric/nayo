"use client"

import type React from "react"

import { useEffect } from "react"
import L from "leaflet"
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet"
import "leaflet/dist/leaflet.css"

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
}

interface PompeData {
  id: string
  nom: string
  capteurs: Capteur[]
  etat: "NORMAL" | "ATTENTION" | "CRITIQUE"
}

interface MapComponentProps {
  pompes: PompeData[]
}

const MapComponent: React.FC<MapComponentProps> = ({ pompes }) => {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/marker-icon-2x.png",
      iconUrl: "/marker-icon.png",
      shadowUrl: "/marker-shadow.png",
    })
  }, [])

  const getStatusColor = (etat: PompeData["etat"]) => {
    switch (etat) {
      case "NORMAL":
        return "green"
      case "ATTENTION":
        return "yellow"
      case "CRITIQUE":
        return "red"
      default:
        return "gray"
    }
  }

  return (
    <MapContainer center={[7.54, -5.54]} zoom={7} scrollWheelZoom={false} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pompes.map((pompe) => (
        <Marker
          key={pompe.id}
          position={[pompe.capteurs[0].localisation.latitude, pompe.capteurs[0].localisation.longitude]}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg mb-2">{pompe.nom}</h3>
              <p className="mb-2">
                État: <span className={`font-semibold text-${getStatusColor(pompe.etat)}-500`}>{pompe.etat}</span>
              </p>
              {pompe.capteurs.map((capteur) => (
                <p key={capteur.idAppareil} className="mb-1">
                  <span className="font-semibold">{capteur.type}:</span> {capteur.derniereMesure.valeur.toFixed(2)}{" "}
                  {capteur.derniereMesure.unite}
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs ${capteur.estActif ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}
                  >
                    {capteur.estActif ? "Actif" : "Inactif"}
                  </span>
                </p>
              ))}
            </div>
          </Popup>
          <CircleMarker
            center={[pompe.capteurs[0].localisation.latitude, pompe.capteurs[0].localisation.longitude]}
            radius={10}
            fillColor={getStatusColor(pompe.etat)}
            color={getStatusColor(pompe.etat)}
            weight={2}
            opacity={0.8}
            fillOpacity={0.4}
          />
        </Marker>
      ))}
    </MapContainer>
  )
}

export default MapComponent


"use client"

import type React from "react"

import { useEffect } from "react"
import L from "leaflet"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

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

interface MapComponentProps {
  capteurs: Capteur[]
}

const MapComponent: React.FC<MapComponentProps> = ({ capteurs }) => {
  useEffect(() => {
    // Correction pour l'icône de marqueur par défaut de Leaflet
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/marker-icon-2x.png",
      iconUrl: "/marker-icon.png",
      shadowUrl: "/marker-shadow.png",
    })
  }, [])

  return (
    <MapContainer center={[46.603354, 1.888334]} zoom={6} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {capteurs.map((capteur) => (
        <Marker key={capteur.id} position={[capteur.localisation.latitude, capteur.localisation.longitude]}>
          <Popup>
            <div>
              <h3 className="font-bold">{capteur.type}</h3>
              <p>ID: {capteur.id}</p>
              <p>
                Dernière mesure: {capteur.derniereMesure.valeur} {capteur.derniereMesure.unite}
              </p>
              <p>Date: {new Date(capteur.derniereMesure.date).toLocaleString()}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default MapComponent


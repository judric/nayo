import { Droplet } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-white shadow-md mt-8">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Droplet className="h-6 w-6 text-blue-500 mr-2" />
            <span className="text-gray-700 font-semibold">NAYO Water Monitoring</span>
          </div>
          <div className="text-gray-500 text-sm">© {new Date().getFullYear()} NAYO. Tous droits réservés.</div>
        </div>
      </div>
    </footer>
  )
}

export default Footer


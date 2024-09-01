import { Link, Outlet } from 'react-router-dom'
import { Button } from "./ui/button"

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">Banco Digital</Link>
            <div className="space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/create-account">Criar Conta</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/accounts">Contas</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/send-transaction">Enviar Transação</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout

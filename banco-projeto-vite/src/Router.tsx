import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import CreateAccount from './pages/CreateAccount'
import Accounts from './pages/Accounts'
import SendTransaction from './pages/SendTransaction'

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="create-account" element={<CreateAccount />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="send-transaction" element={<SendTransaction />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router

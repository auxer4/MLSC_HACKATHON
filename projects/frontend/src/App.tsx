import { SupportedWallet, WalletId, WalletManager, WalletProvider } from '@txnlab/use-wallet-react'
import { SnackbarProvider } from 'notistack'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './Home'
import EnrollmentForm from './components/EnrollmentForm'
import GroupResult from './components/GroupResult'
import AttendanceLogger from './components/AttendanceLogger'
import { getAlgodConfigFromViteEnvironment, getKmdConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs'

let supportedWallets: SupportedWallet[]
if (import.meta.env.VITE_ALGOD_NETWORK === 'localnet') {
  const kmdConfig = getKmdConfigFromViteEnvironment()
  supportedWallets = [
    {
      id: WalletId.KMD,
      options: {
        baseServer: kmdConfig.server,
        token: String(kmdConfig.token),
        port: String(kmdConfig.port),
      },
    },
  ]
} else {
  supportedWallets = [
    { id: WalletId.DEFLY },
    { id: WalletId.PERA },
    { id: WalletId.EXODUS },
    { id: WalletId.LUTE },
  ]
}

export default function App() {
  const algodConfig = getAlgodConfigFromViteEnvironment()

  const walletManager = new WalletManager({
    wallets: supportedWallets,
    defaultNetwork: algodConfig.network,
    networks: {
      [algodConfig.network]: {
        algod: {
          baseServer: algodConfig.server,
          port: algodConfig.port,
          token: String(algodConfig.token),
        },
      },
    },
    options: {
      resetNetwork: true,
    },
  })

  return (
    <SnackbarProvider maxSnack={3}>
      <WalletProvider manager={walletManager}>
        <Router>
          <div className="p-4">
            <nav className="flex gap-4">
              <Link to="/" className="btn btn-ghost">
                Home
              </Link>
              <Link to="/enroll" className="btn btn-ghost">
                Enroll
              </Link>
              <Link to="/group" className="btn btn-ghost">
                My Group
              </Link>
              <Link to="/attendance" className="btn btn-ghost">
                Attendance
              </Link>
            </nav>
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/enroll" element={<EnrollmentForm />} />
            <Route path="/group" element={<GroupResult />} />
            <Route path="/attendance" element={<AttendanceLogger />} />
          </Routes>
        </Router>
      </WalletProvider>
    </SnackbarProvider>
  )
}

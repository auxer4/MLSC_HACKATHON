import React from 'react'
import { Link } from 'react-router-dom'
import { useWallet } from '@txnlab/use-wallet-react'
import ConnectWallet from './components/ConnectWallet'

export default function Home() {
  const { activeAddress } = useWallet()
  const [openWalletModal, setOpenWalletModal] = React.useState(false)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-200 to-teal-200 p-8">
      <div className="max-w-3xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Dynamic Group Allocator + Smart Records</h1>
        <p className="mb-4">
          Problem: Manual group formation is biased, opaque, and inefficient.
        </p>
        <p className="mb-4">
          Solution: Wallet-based student enrollment, AI-driven group formation off-chain, and immutable group &
          attendance records stored on Algorand.
        </p>

        <div className="mb-4">
          <h3 className="font-semibold">Quick Actions</h3>
          <div className="flex gap-2 mt-2">
            <button className="btn" onClick={() => setOpenWalletModal(true)}>{activeAddress ? 'Wallet Connected' : 'Connect Wallet'}</button>
            <Link to="/enroll" className="btn btn-primary">Enroll</Link>
            <Link to="/group" className="btn">My Group</Link>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <h4 className="font-semibold">Architecture</h4>
          <pre className="bg-gray-100 p-2 rounded text-xs">Frontend (wallet) → Off-chain AI allocator → Algorand App (GroupAllocator)</pre>
        </div>
      </div>
      <ConnectWallet openModal={openWalletModal} closeModal={() => setOpenWalletModal(false)} />
    </div>
  )
}

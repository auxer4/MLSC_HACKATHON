import React, { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import sha256 from 'crypto-js/sha256'

export default function AttendanceLogger() {
  const { activeAddress } = useWallet()
  const [text, setText] = useState('')
  const [status, setStatus] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeAddress) return setStatus('Connect your wallet')

    const hash = sha256(text).toString()

    try {
      const res = await fetch('/api/update_metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: activeAddress, metadata_hash: hash }),
      })
      if (res.ok) setStatus('Attendance recorded (request submitted)')
      else setStatus('Failed to submit')
    } catch (e) {
      setStatus('Network error')
    }
  }

  return (
    <div className="card p-4">
      <h2 className="text-2xl font-bold">Attendance / Performance</h2>
      <form onSubmit={submit} className="grid gap-2">
        <textarea className="textarea h-24" value={text} onChange={(e) => setText(e.target.value)} />
        <div className="flex gap-2">
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
          <div className="mt-2">{status}</div>
        </div>
      </form>
    </div>
  )
}

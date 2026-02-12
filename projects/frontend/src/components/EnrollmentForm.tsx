import React, { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'

const SKILLS = ['python', 'web', 'ml', 'ops', 'design']
const ROLES = ['leader', 'researcher', 'frontend', 'infra', 'ux']

export default function EnrollmentForm() {
  const { activeAddress } = useWallet()
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [preference, setPreference] = useState(ROLES[0])
  const [status, setStatus] = useState('')

  const toggleSkill = (skill: string) => {
    setSelectedSkills((s) => (s.includes(skill) ? s.filter((x) => x !== skill) : [...s, skill]))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeAddress) return setStatus('Connect a wallet first')

    const payload = {
      wallet_address: activeAddress,
      skills: selectedSkills,
      preferences: [preference],
    }

    try {
      const res = await fetch('/api/allocate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setStatus('Enrolled — awaiting allocation')
      } else {
        setStatus('Failed to enroll')
      }
    } catch (err) {
      setStatus('Network error')
    }
  }

  return (
    <div className="card p-4">
      <h2 className="text-2xl font-bold">Enrollment</h2>
      {!activeAddress && <div className="p-2 text-sm">Please connect your wallet to enroll.</div>}

      <form onSubmit={submit} className="grid gap-3">
        <div>
          <label className="font-semibold">Select skills</label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {SKILLS.map((s) => (
              <label key={s} className="badge cursor-pointer">
                <input type="checkbox" onChange={() => toggleSkill(s)} checked={selectedSkills.includes(s)} /> {s}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="font-semibold">Role preference</label>
          <select className="select w-full" value={preference} onChange={(e) => setPreference(e.target.value)}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button className="btn btn-primary" type="submit">
            Enroll
          </button>
          <div className="mt-2">{status}</div>
        </div>
      </form>
    </div>
  )
}

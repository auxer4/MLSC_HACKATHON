import React, { useEffect, useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'

type GroupRecord = { group_id: number; members: string[]; metadata_hash: string }

export default function GroupResult() {
  const { activeAddress } = useWallet()
  const [group, setGroup] = useState<GroupRecord | null>(null)
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (!activeAddress) return
    const fetchGroup = async () => {
      try {
        const res = await fetch('/api/groups')
        if (!res.ok) return setStatus('No groups available')
        const data: GroupRecord[] = await res.json()
        const found = data.find((g) => g.members.includes(activeAddress))
        if (found) setGroup(found)
        else setStatus('No group assignment found for this wallet')
      } catch (e) {
        setStatus('Network error')
      }
    }
    fetchGroup()
  }, [activeAddress])

  if (!activeAddress) return <div>Please connect wallet to view your group.</div>

  return (
    <div className="card p-4">
      <h2 className="text-2xl font-bold">Your Group</h2>
      {group ? (
        <div>
          <div className="font-semibold">Group ID: {group.group_id}</div>
          <div className="mt-2">
            <div className="font-semibold">Members</div>
            <ul className="list-decimal ml-6">
              {group.members.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
          <div className="mt-2 text-xs">Metadata hash: {group.metadata_hash}</div>
        </div>
      ) : (
        <div>{status || 'Loading...'}</div>
      )}
    </div>
  )
}

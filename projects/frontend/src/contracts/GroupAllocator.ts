/* Lightweight helper for interacting with the GroupAllocator contract.
   This file exposes functions that the frontend components can call to create groups
   or update metadata. In this template we call a backend REST endpoint which can
   be implemented to use Algokit server-side clients to send ABI calls.
*/

export async function createGroupOnChain(payload: { group_id: number; members: string[]; metadata_hash: string }) {
  // POST to a backend endpoint that has access to an Algokit app client
  const res = await fetch('/api/contract/create_group', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res
}

export async function updateGroupMetadataOnChain(payload: { group_id: number; metadata_hash: string }) {
  const res = await fetch('/api/contract/update_metadata', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res
}

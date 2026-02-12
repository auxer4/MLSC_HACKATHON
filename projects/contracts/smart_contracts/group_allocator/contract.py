from algopy import *
from algopy.arc4 import abimethod


class GroupAllocator(ARC4Contract):
    total_groups: UInt64

    def __init__(self) -> None:
        # box maps keyed by group id (uint64) to bytes
        self.group_members = BoxMap(UInt64, Bytes, key_prefix="members_")
        self.group_meta = BoxMap(UInt64, Bytes, key_prefix="meta_")
        self.total_groups = UInt64(0)

    @abimethod()
    def create_group(self, group_id: UInt64, student_wallets: Bytes, metadata_hash: Bytes) -> None:
        # student_wallets: comma-separated addresses as utf-8 bytes
        # Ensure group doesn't already exist
        existing, exists = self.group_members.maybe(group_id)
        assert not exists, "Group already exists"

        # store members and metadata
        self.group_members[group_id] = student_wallets
        self.group_meta[group_id] = metadata_hash

        self.total_groups += UInt64(1)

    @abimethod()
    def update_group_metadata(self, group_id: UInt64, metadata_hash: Bytes) -> None:
        # Only contract creator can update metadata
        assert Txn.sender == Global.creator_address, "Only creator can update metadata"

        _, exists = self.group_members.maybe(group_id)
        assert exists, "Group does not exist"

        self.group_meta[group_id] = metadata_hash

    # Read helpers (non-ABI) could be added but ABI methods suffice for demo

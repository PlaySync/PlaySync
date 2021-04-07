from includes.api_auth import *
from includes.tasker import *
from includes.psql_conn import psql_write_syncpair, psql_read_syncpair, psql_delete_syncpair
# import json
def new_sync_pair(uid: int, origin_platform: str, target_platform: str, origin_playlist_id: str, target_playlist_id: str):
    psql_write_syncpair(uid, origin_platform, target_platform, origin_playlist_id, target_playlist_id)

def list_user_sync_pair(uid: int):
    if uid < -1:
        return None # invalid uid
    else:
        syncpairs = []
        db_pairs = psql_read_syncpair(uid)
        if len(db_pairs)>0:
            for pair_tuple in db_pairs:
                if len(pair_tuple)==5 and pair_tuple[0]==uid: # Just double check.
                    pair = {}
                    pair['uid'] = pair_tuple[0]
                    pair['from']={'platform':pair_tuple[1], 'id':pair_tuple[3]}
                    pair['to']={'platform':pair_tuple[2], 'id':pair_tuple[4]}
                    syncpairs.append(pair)
        return syncpairs

def remove_user_sync_pair(target_platform: str, target_playlist_id: str):
    psql_delete_syncpair(target_platform, target_playlist_id)

def test_sync_funcs():
    new_sync_pair(1, "platA", "platB", "A000001", "B111110")
    new_sync_pair(1, "platA", "platC", "A000011", "C111100")
    new_sync_pair(1, "platC", "platA", "C000001", "A111110")
    new_sync_pair(1, "platC", "platB", "C000011", "B111100")
    syncpairs = list_user_sync_pair(1)
    assert len(syncpairs) == 4
    remove_user_sync_pair("platB", "B111110")
    remove_user_sync_pair("platC", "C111100")
    remove_user_sync_pair("platA", "A111110")
    remove_user_sync_pair("platB", "B111100")
    syncpairs = list_user_sync_pair(1)
    assert len(syncpairs) == 0
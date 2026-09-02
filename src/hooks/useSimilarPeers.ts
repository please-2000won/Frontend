import { useCallback, useEffect, useState } from 'react';
import { getPeerComparison, getRandomPeers } from '../api/peers';
import {
  DEFAULT_MY_PROFILE,
  SIMILAR_PEOPLE,
  type PeerFinancialProfile,
} from '../constants/main/mockData';
import { mapSummaryToProfile } from '../utils/mapFinancialInfo';

export interface PeerCard {
  peerUserId: number;
  nickname: string;
  similarityScore: number;
}

export interface PeerComparePayload {
  myProfile: PeerFinancialProfile;
  peerName: string;
  peerProfile: PeerFinancialProfile;
}

const GUEST_PEERS: PeerCard[] = SIMILAR_PEOPLE.map((person) => ({
  peerUserId: person.peerUserId,
  nickname: person.nickname,
  similarityScore: person.similarityScore,
}));

// 메인 페이지 하단 "나와 유사한 사람들" 섹션 데이터.
// - 랜덤 피어 3명: 페이지 접근 시 GET /api/v1/peers/random
// - 피어 클릭 시 1:1 비교: GET /api/v1/peers/{peerUserId}
export const useSimilarPeers = (isGuestMode: boolean, hasAssetInfo: boolean) => {
  const [peers, setPeers] = useState<PeerCard[]>(isGuestMode ? GUEST_PEERS : []);

  useEffect(() => {
    if (isGuestMode || !hasAssetInfo) return;

    let cancelled = false;

    getRandomPeers(3)
      .then((result) => {
        if (!cancelled) setPeers(result);
      })
      .catch(() => {
        if (!cancelled) setPeers([]);
      });

    return () => {
      cancelled = true;
    };
  }, [isGuestMode, hasAssetInfo]);

  const getComparison = useCallback(
    async (peerUserId: number): Promise<PeerComparePayload | null> => {
      if (isGuestMode) {
        const peer = SIMILAR_PEOPLE.find((p) => p.peerUserId === peerUserId);
        if (!peer) return null;
        return {
          myProfile: DEFAULT_MY_PROFILE,
          peerName: peer.nickname,
          peerProfile: peer.financialProfile,
        };
      }

      try {
        const { me, peer } = await getPeerComparison(peerUserId);
        return {
          myProfile: mapSummaryToProfile(me),
          peerName: peer.nickname,
          peerProfile: mapSummaryToProfile(peer),
        };
      } catch {
        return null;
      }
    },
    [isGuestMode]
  );

  return { peers: isGuestMode ? GUEST_PEERS : peers, getComparison };
};

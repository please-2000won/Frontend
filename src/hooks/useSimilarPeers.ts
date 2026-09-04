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

type PeersStatus = 'loading' | 'success' | 'error';

const GUEST_PEERS: PeerCard[] = SIMILAR_PEOPLE.map((person) => ({
  peerUserId: person.peerUserId,
  nickname: person.nickname,
  similarityScore: person.similarityScore,
}));

// 메인 페이지 하단 "나와 유사한 사람들" 섹션 데이터.
// - 랜덤 피어 3명: 페이지 접근 시 GET /api/v1/peers/random
// - 피어 클릭 시 1:1 비교: GET /api/v1/peers/{peerUserId}
// 로딩/에러 상태를 구분해서, 로딩 중에 "불러오지 못했어요"가 뜨지 않도록 한다.
export const useSimilarPeers = (isGuestMode: boolean, hasAssetInfo: boolean) => {
  const [peers, setPeers] = useState<PeerCard[]>(isGuestMode ? GUEST_PEERS : []);
  const [status, setStatus] = useState<PeersStatus>(
    isGuestMode ? 'success' : 'loading'
  );

  useEffect(() => {
    if (isGuestMode || !hasAssetInfo) return;

    // status 초기값이 'loading'이라 여기서 다시 세팅하지 않는다.
    let cancelled = false;

    getRandomPeers(3)
      .then((result) => {
        if (cancelled) return;
        setPeers(result);
        setStatus('success');
      })
      .catch(() => {
        if (cancelled) return;
        setPeers([]);
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [isGuestMode, hasAssetInfo]);

  // "다시 분석하기" 이후 피어 매칭이 새로 갱신되므로 다시 불러온다.
  const refetch = useCallback(async () => {
    if (isGuestMode) return;
    setStatus('loading');
    try {
      const result = await getRandomPeers(3);
      setPeers(result);
      setStatus('success');
    } catch {
      setPeers([]);
      setStatus('error');
    }
  }, [isGuestMode]);

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

  if (isGuestMode) {
    return {
      peers: GUEST_PEERS,
      isLoading: false,
      isError: false,
      getComparison,
      refetch,
    };
  }

  return {
    peers,
    isLoading: status === 'loading',
    isError: status === 'error',
    getComparison,
    refetch,
  };
};

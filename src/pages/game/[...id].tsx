import Countdown from '@/components/Countdown';
import LoadingScreen from '@/components/LoadingScreen';
import { useUser } from '@/hooks/useUser';
import { db } from '@/services/database';
import { get, onValue, ref, serverTimestamp, set } from 'firebase/database';
import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import { useObject } from 'react-firebase-hooks/database';
import cloudinary from 'cloudinary';
import { Images } from '@/types/cloudinaryImages';
import Board from '@/components/Board';
import { Container } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { correctCardsAtom } from '@/atoms/Card.atom';
import { isWinAtom } from '@/atoms/IsWin.atom';

const Game = ({
  tournamentId,
  gameId,
  images,
}: {
  tournamentId: string;
  gameId: string;
  images: Images;
}) => {
  const gameRef = ref(db, `games/${tournamentId}/${gameId}`);
  const [game, loading] = useObject(gameRef);
  const [isEverybodyJoined, setIsEverybodyJoined] = useState(false);
  const { userId } = useUser();
  const correctCards = useRecoilValue(correctCardsAtom);
  const isWin = useRecoilValue(isWinAtom);

  useEffect(() => {
    const hasJoinedRef = ref(
      db,
      `games/${tournamentId}/${gameId}/players/${userId}/hasJoined`,
    );
    set(hasJoinedRef, true);
  }, [gameId, tournamentId, userId]);

  useEffect(() => {
    const scoreRef = ref(
      db,
      `games/${tournamentId}/${gameId}/players/${userId}/score`,
    );
    set(scoreRef, correctCards.length / 2);
  }, [correctCards, gameId, tournamentId, userId]);

  useEffect(() => {
    const endedRef = ref(
      db,
      `games/${tournamentId}/${gameId}/players/${userId}/ended`,
    );
    if (isWin) {
      set(endedRef, serverTimestamp());
    }
  }, [gameId, isWin, tournamentId, userId]);

  useEffect(() => {
    const playersRef = ref(db, `games/${tournamentId}/${gameId}/players`);
    const unsubscribe = onValue(playersRef, (playersSnapshot) => {
      const players = playersSnapshot.val();
      setIsEverybodyJoined(
        Object.values(players).every((player: any) => player.hasJoined),
      );
    });
    return () => unsubscribe();
  }, [gameId, tournamentId]);

  if (loading || !game) {
    return <LoadingScreen />;
  }

  if (!isEverybodyJoined) {
    return <div>Czekamy na resztę graczy...</div>;
  }

  return (
    <>
      <Countdown />
      <Container className="mt-5 mx-auto">
        <Board images={images} seed={game?.val().seed} />
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string[] };

  if (id.length !== 2) {
    return {
      notFound: true,
    };
  }

  const tournamentId = id[0].replace(/-/i, ` `);
  const gameId = id[1];

  const gameRef = ref(db, `games/${tournamentId}/${gameId}/size`);
  const size = (await get(gameRef)).val();

  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const images = (await cloudinary.v2.api.resources(
    {
      max_results: size,
      type: `upload`,
      prefix: `cats`,
    },
    (err, result) => result,
  )) as Images;
  images.rate_limit_reset_at = null;

  return {
    props: {
      tournamentId,
      gameId,
      images,
    },
  };
};

export default Game;

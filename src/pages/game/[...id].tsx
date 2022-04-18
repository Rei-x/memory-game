import Countdown from '@/components/Countdown';
import LoadingScreen from '@/components/LoadingScreen';
import { useUser } from '@/hooks/useUser';
import { db } from '@/services/database';
import {
  get,
  onChildAdded,
  onValue,
  ref,
  serverTimestamp,
  set,
} from 'firebase/database';
import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import { useObject, useObjectVal } from 'react-firebase-hooks/database';
import cloudinary from 'cloudinary';
import { Images } from '@/types/cloudinaryImages';
import Board from '@/components/Board';
import { Container, Spinner } from 'react-bootstrap';
import { useRecoilValue, useRecoilState, useResetRecoilState } from 'recoil';
import { correctCardsAtom, selectedCards } from '@/atoms/Card.atom';
import { isWinAtom } from '@/atoms/IsWin.atom';
import Confetti from 'react-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';

const Game = ({
  tournamentId,
  gameId,
  images,
}: {
  tournamentId: string;
  gameId: string;
  images: Images;
}) => {
  const { userId } = useUser();
  const [isEverybodyJoined, setIsEverybodyJoined] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();

  const gameRef = ref(db, `games/${tournamentId}/${gameId}`);
  const [game, loading] = useObject(gameRef);
  const [player, playerLoading] = useObject(
    ref(db, `games/${tournamentId}/${gameId}/players/${userId}`),
  );
  const [winner] = useObjectVal(ref(db, `winners/${tournamentId}`));

  const correctCards = useRecoilValue(correctCardsAtom);
  const [isWin, setIsWin] = useRecoilState(isWinAtom);

  const resetCorrectCards = useResetRecoilState(correctCardsAtom);
  const resetWin = useResetRecoilState(isWinAtom);
  const resetSelectedCards = useResetRecoilState(selectedCards);

  useEffect(() => {
    if (isWin) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  }, [isWin]);

  useEffect(() => {
    const hasJoinedRef = ref(
      db,
      `games/${tournamentId}/${gameId}/players/${userId}/hasJoined`,
    );
    set(hasJoinedRef, true);
  }, [gameId, tournamentId, userId]);

  useEffect(() => {
    if (player?.child(`ended`).exists()) return;
    const scoreRef = ref(
      db,
      `games/${tournamentId}/${gameId}/players/${userId}/score`,
    );
    set(scoreRef, correctCards.length / 2);
  }, [correctCards, gameId, player, tournamentId, userId]);

  useEffect(() => {
    const endedRef = ref(
      db,
      `games/${tournamentId}/${gameId}/players/${userId}/ended`,
    );

    const setEndTime = async () => {
      if (isWin && !player?.child(`ended`).exists()) {
        set(endedRef, serverTimestamp());
      }
    };
    setEndTime();
  }, [gameId, isWin, player, tournamentId, userId]);

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

  useEffect(() => {
    if (player?.child(`ended`).exists()) {
      setIsWin(true);
    }
  }, [player, setIsWin]);

  useEffect(() => {
    const gamesRef = ref(db, `games/${tournamentId}`);
    const unsubscribe = onChildAdded(gamesRef, async (game, previousGame) => {
      const sortedArray = [game.key, previousGame].sort();
      const newestGame = sortedArray[1];
      if (!userId) return;
      if (newestGame === gameId) return;
      const isPlayerInNewGame = Object.keys(game.val().players).includes(
        userId,
      );

      if (isPlayerInNewGame) {
        const hasJoinedAlready = !!game.val().players[userId].hasJoined;
        if (!hasJoinedAlready) {
          resetWin();
          resetCorrectCards();
          resetSelectedCards();
          setShowConfetti(false);
          await router.push(
            `/game/${tournamentId.replaceAll(` `, `-`)}/${game.key}`,
          );
          return;
        }
      } else {
        resetWin();
        resetCorrectCards();
        resetSelectedCards();
        setShowConfetti(false);
        await router.push(`/loser/${tournamentId.replaceAll(` `, `-`)}`);
      }
    });
    return () => unsubscribe();
  }, [
    gameId,
    resetCorrectCards,
    resetSelectedCards,
    resetWin,
    router,
    tournamentId,
    userId,
  ]);

  useEffect(() => {
    if (winner) {
      router.push(`/winner/${tournamentId}`);
    }
  }, [router, tournamentId, winner]);

  if (loading || !game || playerLoading) {
    return <LoadingScreen />;
  }

  if (!isEverybodyJoined) {
    return <div>Waiting for other players...</div>;
  }

  return (
    <>
      <Container className="mt-5 mx-auto">
        <Confetti run={isWin} recycle={showConfetti} />
        <AnimatePresence>
          {!isWin && (
            <motion.div
              layout
              key="board"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Countdown />
              <Board images={images} seed={game?.val().seed} />
            </motion.div>
          )}
          {isWin && (
            <motion.div
              layout
              key="win"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center">
                <h1>You won!!!</h1>
                <div>Wait for the next game..</div>
                <Spinner
                  className="mt-3"
                  animation="border"
                  variant="primary"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
      prefix: `kajtek`,
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

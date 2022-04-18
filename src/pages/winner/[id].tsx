import Layout from '@/components/Layout';
import { GetServerSideProps } from 'next';
import { motion, useAnimation } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { db } from '@/services/database';
import { ref } from 'firebase/database';
import { useObjectVal } from 'react-firebase-hooks/database';
import Confetti from 'react-confetti';

const Winner = ({ tournamentId }: { tournamentId: string }) => {
  const [winner] = useObjectVal(ref(db, `winners/${tournamentId}`));
  const [showConfetti, setShowConfetti] = useState(false);
  const animation = useAnimation();

  useEffect(() => {
    setTimeout(() => {
      setShowConfetti(true);
      animation.start({ scale: 1, opacity: 1, rotate: 360 });
    }, 3000);
  }, [animation]);

  return (
    <Layout>
      {showConfetti && <Confetti />}
      <div
        style={{
          margin: 0,
          position: `absolute`,
          top: `50%`,
          left: `50%`,
          width: `100vw`,
          transform: `translate(-50%, -50%)`,
        }}
      >
        <h1 className="text-center">The winner of the tournament is...</h1>
        <div className="text-center">
          <motion.div
            style={{ fontSize: `3rem` }}
            onAnimationEnd={() => setShowConfetti(true)}
            transition={{ duration: 4, type: `spring`, stiffness: 1000 }}
            initial={{ opacity: 0, scale: 0.1 }}
            animate={animation}
          >
            {winner}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  const tournamentId =
    typeof id === `string` ? id.replace(/-/i, ` `) : `undefined`;

  return {
    props: {
      tournamentId,
    },
  };
};

export default Winner;

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Countdown = () => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      if (count <= -1) {
        clearInterval(interval);
        return;
      }
      setCount((count) => count - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [count]);

  const backgroundVariants = {
    0: {
      opacity: [0.9, 0],
    },
  };

  const variants = {
    0: {
      backgroundColor: `#27f234`,
      scale: [1, 4],
      rotate: [0, 180],
      opacity: [0.9, 0],
    },
    1: {
      backgroundColor: `#f2f227`,
    },
    2: {
      backgroundColor: `#d17615`,
    },
    3: {
      backgroundColor: `#d1154d`,
    },
  };

  if (count === -1) return null;

  return (
    <motion.div
      variants={backgroundVariants}
      animate={count.toString()}
      style={{
        position: `absolute`,
        top: 0,
        left: 0,
        height: `100%`,
        width: `100vw`,
        overflow: `hidden`,
        backgroundColor: `#f2f2f2F0`,
        display: `flex`,
        justifyContent: `center`,
        alignItems: `center`,
        zIndex: 1030,
      }}
    >
      <motion.div
        variants={variants}
        animate={count.toString()}
        style={{
          width: `200px`,
          height: `200px`,
          fontSize: `2rem`,
          fontWeight: `bold`,
          textAlign: `center`,
          borderRadius: `50%`,
          verticalAlign: `center`,
        }}
      >
        <p
          style={{
            paddingTop: `70px`,
          }}
        >
          {count}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Countdown;

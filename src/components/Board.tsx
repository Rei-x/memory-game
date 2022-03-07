import { Images } from '@/types/cloudinaryImages';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import NextImage from 'next/image';

const shuffleArray = (array: any[]) => {
  const newArray = JSON.parse(JSON.stringify(array));
  newArray.sort(() => 0.5 - Math.random());
  return newArray;
};

const Board = ({ images }: { images: Images }) => {
  const firstCards = images.resources.map((card) => ({
    ...card,
    asset_id: `${card.asset_id}-1`,
  }));
  const secondCards = images.resources.map((card) => ({
    ...card,
    asset_id: `${card.asset_id}-2`,
  }));
  const [cards, setCards] = useState([...firstCards, ...secondCards]);
  useEffect(() => {
    setCards((cards) => shuffleArray(cards));
    console.log(cards);
  }, []);
  return (
    <Container className="d-flex flex-wrap">
      {cards.map((image) => (
        <div key={image.asset_id} className="rounded inline-block">
          <NextImage src={image.url} width="80" height="80" />
        </div>
      ))}
    </Container>
  );
};

export default Board;

import { selectedCards as selectedCardsSelector } from '@/atoms/Card.atom';
import { useCards } from '@/hooks/useCards';
import { Images } from '@/types/cloudinaryImages';
import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import Card from './Card';

const shuffleArray = (array: any[]) => {
  const newArray = JSON.parse(JSON.stringify(array)) as any[];
  newArray.sort(() => 0.5 - Math.random());
  return newArray;
};

const Board = ({ images }: { images: Images }) => {
  const [cards, setCards] = useCards(images);
  const [selectedCards, setSelectedCards] = useRecoilState(
    selectedCardsSelector,
  );

  useEffect(() => {
    if (selectedCards.first !== null && selectedCards.second !== null) {
      setTimeout(() => {
        setSelectedCards({
          first: null,
          second: null,
        });
      }, 500);
    }
  }, [selectedCards.first, selectedCards.second, setSelectedCards]);

  return (
    <Container>
      <button onClick={() => setCards((cards) => shuffleArray(cards))}>
        shuffle cards
      </button>
      <Container className="d-flex flex-wrap">
        {cards.map((image) => (
          <Card key={image.asset_id} image={image} />
        ))}
      </Container>
    </Container>
  );
};

export default Board;

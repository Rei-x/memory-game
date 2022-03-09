import { selectedCards as selectedCardsSelector } from '@/atoms/Card.atom';
import { useCards } from '@/hooks/useCards';
import { useCheckForWin } from '@/hooks/useCheckForWin';
import { Images } from '@/types/cloudinaryImages';
import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import seedrandom from 'seedrandom';
import Card from './Card';

const shuffleArray = (array: any[]) => {
  const rng = seedrandom(`luigi`);
  const newArray = JSON.parse(JSON.stringify(array)) as any[];
  newArray.sort(() => 0.5 - rng());
  return newArray;
};

const Board = ({ images }: { images: Images }) => {
  const [cards, setCards] = useCards(images);
  const [selectedCards, setSelectedCards] = useRecoilState(
    selectedCardsSelector,
  );
  const isWin = useCheckForWin(cards);

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
      {isWin && <div>Wygrałeś!!</div>}
    </Container>
  );
};

export default Board;

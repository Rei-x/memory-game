import { selectedCards as selectedCardsSelector } from '@/atoms/Card.atom';
import { isWinAtom } from '@/atoms/IsWin.atom';
import { useCards } from '@/hooks/useCards';
import { useCheckForWin } from '@/hooks/useCheckForWin';
import { Images } from '@/types/cloudinaryImages';
import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useRecoilState, useSetRecoilState } from 'recoil';
import Card from './Card';

const Board = ({ images, seed }: { images: Images; seed: string }) => {
  const [cards] = useCards(images, seed);
  const [selectedCards, setSelectedCards] = useRecoilState(
    selectedCardsSelector,
  );
  const isWin = useCheckForWin(cards);
  const setWin = useSetRecoilState(isWinAtom);

  useEffect(() => {
    setWin(isWin);
  }, [isWin, setWin]);

  useEffect(() => {
    if (selectedCards.first !== null && selectedCards.second !== null) {
      if (selectedCards.first.url === selectedCards.second.url) {
        setSelectedCards({
          first: null,
          second: null,
        });
      } else {
        setTimeout(() => {
          setSelectedCards({
            first: null,
            second: null,
          });
        }, 500);
      }
    }
  }, [selectedCards.first, selectedCards.second, setSelectedCards]);

  return (
    <Container className="mx-auto">
      <Container className="d-flex flex-wrap mx-auto justify-content-center overflow-hidden">
        {cards.map((image) => (
          <Card key={image.asset_id} image={image} />
        ))}
      </Container>
    </Container>
  );
};

export default Board;

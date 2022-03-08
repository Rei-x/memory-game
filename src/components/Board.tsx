import { correctCardsAtom, selectedCardsAtom } from '@/atoms/Board';
import { Images, Resource } from '@/types/cloudinaryImages';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useRecoilState, useSetRecoilState } from 'recoil';
import Card from './Card';

const shuffleArray = (array: any[]) => {
  const newArray = JSON.parse(JSON.stringify(array));
  newArray.sort(() => 0.5 - Math.random());
  return newArray;
};

const Board = ({ images }: { images: Images }) => {
  const [selectedCards, setSelectedCards] = useRecoilState(selectedCardsAtom);
  const setCorrectCards = useSetRecoilState(correctCardsAtom);

  useEffect(() => {
    if (selectedCards.first !== null && selectedCards.second !== null) {
      if (selectedCards.first.url === selectedCards.second.url) {
        setCorrectCards(
          (cards) =>
            [...cards, selectedCards.first, selectedCards.second] as Resource[],
        );
        setSelectedCards(() => ({
          first: null,
          second: null,
        }));
      } else {
        setTimeout(() => {
          setSelectedCards(() => ({
            first: null,
            second: null,
          }));
        }, 500);
      }
    }
  }, [
    selectedCards.first,
    selectedCards.second,
    setCorrectCards,
    setSelectedCards,
  ]);

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
        <Card key={image.asset_id} image={image} />
      ))}
    </Container>
  );
};

export default Board;

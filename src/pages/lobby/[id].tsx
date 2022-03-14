import Layout from '@/components/Layout';
import { db } from '@/services/database';
import { ref } from 'firebase/database';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useObject } from 'react-firebase-hooks/database';

const Lobby = ({
  tournamentId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [tournament] = useObject(ref(db, `tournament/${tournamentId}`));

  return (
    <Layout>
      <Container>
        <h1>{tournamentId}</h1>
        <div>Lobby {tournamentId}</div>
        <pre>{JSON.stringify(tournament?.val())}</pre>
        <h3>Gracze</h3>
        <ul>
          {tournament &&
            Object.keys(tournament?.val().players).map((nickname) => (
              <li key={nickname}>{nickname}</li>
            ))}
        </ul>
      </Container>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  return {
    props: {
      tournamentId: id.replaceAll(`-`, ` `),
    },
  };
};

export default Lobby;

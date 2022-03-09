import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { useList } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { useDatabase } from '@/hooks/useDatabase';
import { db } from '@/services/database';

const Firebase = () => {
  const [snapshots] = useList(ref(db, `cards`));
  const [value, setValue] = useState(``);
  const [path, setPath] = useState(``);

  const database = useDatabase();

  const addPoints = () => {
    database.setData(path, value);
  };

  return (
    <Container>
      Firebase
      <div>
        {snapshots?.map((snapshot) => (
          <div key={snapshot.key}>
            {snapshot.key}:{JSON.stringify(snapshot.val())}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button onClick={() => addPoints()}>Dodaj</button>
      </div>
    </Container>
  );
};

export default Firebase;

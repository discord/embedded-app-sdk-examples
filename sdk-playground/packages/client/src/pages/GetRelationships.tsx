import React from 'react';

import discordSdk from '../discordSdk';
import RelationshipList from '../components/RelationshipList';


type GetRelationshipsReturnType = Awaited<ReturnType<typeof discordSdk.commands.getRelationships>>;

/**
 * Requires "relationships.read" scope to be enabled in authActions.ts
 */
export default function GetRelationships() {
  const [relationships, setRelationships] = React.useState<GetRelationshipsReturnType['relationships']>([]);

  React.useEffect(() => {
    async function getRelationships() {
      const {relationships} = await discordSdk.commands.getRelationships();
      setRelationships(relationships);
    }
    getRelationships();
  }, []);

  return <div style={{padding: 32}}>
      <div>
        <h1>Get Relationships</h1>
        <br />
        <RelationshipList relationships={relationships} onClick={(rel) => console.log(rel)}/>
      </div>
    </div>;
}

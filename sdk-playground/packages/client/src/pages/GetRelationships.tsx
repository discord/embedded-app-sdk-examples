import React from 'react';

import discordSdk from '../discordSdk';
import RelationshipList from '../components/RelationshipList';
import ReactJsonView from '../components/ReactJsonView';


type GetRelationshipsReturnType = Awaited<ReturnType<typeof discordSdk.commands.getRelationships>>;

/**
 * Requires "relationships.read" scope to be enabled in authActions.ts
 */
export default function GetRelationships() {
  const [relationships, setRelationships] = React.useState<GetRelationshipsReturnType['relationships']>([]);

  const [selectedRelationship, setSelectedRelationship] = React.useState<GetRelationshipsReturnType['relationships'][0] | null>(null);

  React.useEffect(() => {
    async function getRelationships() {
      const {relationships} = await discordSdk.commands.getRelationships();
      setRelationships(relationships);
    }
    getRelationships();
  }, []);

  return <div style={{padding: 32, display: 'flex'}}>
      <div>
        <h1>Get Relationships</h1>
        <br />
        <RelationshipList relationships={relationships} onClick={(rel) => setSelectedRelationship(rel)}/>
      </div>
      <div style={{marginRight: '16px'}}>
        <h2>Selected Relationship</h2>
        {selectedRelationship == null ? null : <ReactJsonView src={selectedRelationship} />}
      </div>
    </div>;
}

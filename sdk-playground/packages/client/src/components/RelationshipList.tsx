import React from 'react';
import discordSdk from '../discordSdk';

type GetRelationshipsReturnType = Awaited<ReturnType<typeof discordSdk.commands.getRelationships>>;

export default function RelationshipList({relationships, onClick}: {
  relationships: GetRelationshipsReturnType['relationships'],
  onClick: (relationship: GetRelationshipsReturnType['relationships'][0]) => void
}) {
  const relationshipItems = relationships.map((relationship) => {
    if (relationship.user == null) {
      return <></>
    }
    const user = relationship.user
    return <button style={{margin: '0 0 8px', padding: '8px 0 8px 0', display: 'block', width: '400px'}} key={user.id} onClick={() => onClick(relationship)}>{user.username}</button>;
  });
  return <div style={{display: 'flex', flexDirection: 'column', height: '600px', 'overflowY': 'scroll'}}>
    { relationshipItems}
  </div>
}

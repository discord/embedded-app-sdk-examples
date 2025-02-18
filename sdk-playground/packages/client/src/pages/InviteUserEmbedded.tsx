import React from 'react';
import discordSdk from '../discordSdk';
import useHasPermission from '../utils/useHasPermission';

import {Permissions as SDKPermissions} from '@discord/embedded-app-sdk';

type GetRelationshipsReturnType = Awaited<ReturnType<typeof discordSdk.commands.getRelationships>>;

/**
 * Requires "relationships.read" scope to be enabled in authActions.ts
 */
export default function InviteUserEmbedded() {

  const [userId, setUserId] = React.useState<string>('');
  const [inviting, setInviting] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [messageContent, setMessageContent] = React.useState<string>('');
  const [searchUsername, setSearchUsername] = React.useState<string>('');
  const canCreateInvite = useHasPermission(SDKPermissions.CREATE_INSTANT_INVITE);

  const [relationships, setRelationships] = React.useState<GetRelationshipsReturnType['relationships']>([]);
  const [filteredRelationships, setFilteredRelationships] = React.useState<GetRelationshipsReturnType['relationships']>([]);

  React.useEffect(() => {
    async function getRelationships() {
      const {relationships} = await discordSdk.commands.getRelationships();
      setRelationships(relationships);
    }
    getRelationships();
  }, []);

  React.useEffect(() => {
    if (discordSdk.guildId == null || canCreateInvite) {
      // discordSdk.guildId == null means the app is running in a dm or group dm
      // and doesn't require permissions to invite users
      setError(null);
      return;
    }
    setError('User doesn\'t have permission to invite for an app running in a server');
  }, [canCreateInvite])

  const relationshipItems = filteredRelationships
    .map((relationship) => {
      const user = relationship.user
      return <button style={{margin: '0 0 8px', padding: '8px 0 8px 0', display: 'block', width: '400px'}} key={user.id} onClick={() => setUserId(user.id)}>{user.username}</button>;
  });

  React.useEffect(() => {
    setFilteredRelationships(relationships.filter((relationship) => searchUsername.length === 0 || relationship.user.username.includes(searchUsername)))
  }, [searchUsername, relationships]);

  const inviteUser = async () => {
    setError(null);
    if (userId.length === 0) {
      setError('User ID is required');
      return;
    }
    setInviting(true);
    try {
      const rpcPayload: {
        user_id: string;
        content?: string;
      } = {user_id: userId};
      if (messageContent.length > 0) {
        rpcPayload.content = messageContent;
      }
      await discordSdk.commands.inviteUserEmbedded(rpcPayload);
    } catch (err: any) {
      setError('unknown issue');
    }
    setInviting(false);
  }
  return (
    <div style={{padding: 32}}>
      <h1>invite user to activity</h1>
      <div style={{display: 'flex'}}>
        <div>
          <h2>Friends List</h2>
          <input placeholder='Username search' value={searchUsername} onChange={(e) => {setSearchUsername(e.target.value)}}/>
          <div style={{display: 'flex', flexDirection: 'column', height: '600px', 'overflowY': 'scroll'}}>
          { relationshipItems}
          </div>
        </div>
        <div style={{marginRight: '16px'}}>
          <div>Message Content</div>
          <textarea placeholder="something" name="postContent" onChange={(e) => setMessageContent(e.target.value)} rows={4} cols={40} />
          <br/>
          <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
          <button disabled={inviting} onClick={inviteUser}>
            Send Invite to user
          </button>
          { error != null ? <div style={{color: 'red'}}>{error}</div> : null}
        </div>
      </div>
    </div>
  )
}

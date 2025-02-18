import React from 'react';
import discordSdk from '../discordSdk';
import {RPCErrorCodes, Permissions as SDKPermissions, PermissionUtils} from '@discord/embedded-app-sdk';
import useHasPermission from '../utils/useHasPermission';

export default function OpenInviteDialog() {
  const [message, setMessage] = React.useState<string>('Checking for permissions...');

  const canCreateInvite = useHasPermission(SDKPermissions.CREATE_INSTANT_INVITE);
  const [hasPermissionToInvite, setHasPermissionToInvite] = React.useState<boolean>(false);

  React.useEffect(() => {
    setHasPermissionToInvite(canCreateInvite);
    if (canCreateInvite) {
      setMessage("Invite Dialog hasn't been opened... yet!");
    } else {
      setMessage('You do not have permission to create invites to this channel!');
    }
  }, [canCreateInvite]);

  const doOpenInviteDialog = async () => {
    try {
      await discordSdk.commands.openInviteDialog();
      setMessage('Invite Dialog opened!');
    } catch (err: any) {
      if (err.code === RPCErrorCodes.INVALID_PERMISSIONS) {
        setMessage("You don't have permission to create invite!");
      } else {
        const errorMessage = err.message ?? 'Unknown';
        setMessage(`Failed to open Invite Dialog. Reason: ${errorMessage}`);
      }
    }
  };
  return (
    <div style={{padding: 32}}>
      <h1>Open Invite Dialog</h1>
      <h2>{message}</h2>
      <button disabled={!hasPermissionToInvite} onClick={doOpenInviteDialog}>
        Click to Open Invite Dialog!
      </button>
    </div>
  );
}

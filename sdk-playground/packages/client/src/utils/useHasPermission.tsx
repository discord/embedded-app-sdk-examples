import React from 'react';
import discordSdk from '../discordSdk';
import {Permissions as SDKPermissions, PermissionUtils} from '@discord/embedded-app-sdk';

type BigFlag = typeof SDKPermissions.CREATE_INSTANT_INVITE;

export default function useHasPermission(permission: BigFlag) {
  const [hasPermission, setHasPermission] = React.useState<boolean>(false);

  React.useEffect(() => {
    const calculatePermissions = async () => {
      const {permissions} = await discordSdk.commands.getChannelPermissions();
      console.log('permissions', permissions);
      const hasPermissionFlag = PermissionUtils.can(permission, permissions);
      setHasPermission(hasPermissionFlag);
    };
    calculatePermissions();
  }, [permission]);

  return hasPermission;
}

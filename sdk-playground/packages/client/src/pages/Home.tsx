import discordSdk from '../discordSdk';

export default function Home() {
  const instanceId = discordSdk.instanceId;
  const clientId = discordSdk.clientId;
  const channelId = discordSdk.channelId;
  const guildId = discordSdk.guildId;
  const platform = discordSdk.platform;
  const mobileAppVersion = discordSdk.mobileAppVersion;
  const sdkVersion = discordSdk.sdkVersion;
  return (
    <div style={{padding: 32}}>
      <h1>Welcome to the SDK playground! 🎉</h1>
      <p>
        This is a place for testing out all of the capabilities of the Embedded App SDK as well as validating
        platform-specific behavior related to Activities in Discord.
      </p>
      <br></br>
      <h3> Basic Activity Info</h3>
      <p> Custom ID: {discordSdk.customId} </p>
      <p> Instance ID: {instanceId} </p>
      <p> Referrer ID: {discordSdk.referrerId} </p>
      <p> Client ID: {clientId} </p>
      <p> Channel ID: {channelId} </p>
      { guildId != null ? (<p> Guild ID: {guildId} </p>) : null }
      <p> Platform: {platform} </p>
      { mobileAppVersion != null ? (<p> Mobile App Version: {mobileAppVersion} </p>) : null }
      <p> Using SDK Version: {sdkVersion } </p>
    </div>
  );
}

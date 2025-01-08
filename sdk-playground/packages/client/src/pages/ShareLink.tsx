import React from 'react';
import discordSdk from '../discordSdk';

export default function ShareLink() {
  const [message, setMessage] = React.useState<string>('Come Play SDK Playground!');
  const [customId, setCustomId] = React.useState<string | undefined >(undefined);
  const [referrerId, setReferrerId] = React.useState<string | undefined >(undefined);

  const [hasPressedSend, setHasPressedSend] = React.useState<boolean>(false);
  const [didSend, setDidSend] = React.useState<boolean>(false);

  const handleMessageChange= (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };
  const handleCustomIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomId(event.target.value);
  };
  const handleReferrerIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReferrerId(event.target.value);
  };

  const doShareLink = async () => {
    const { success} = await discordSdk.commands.shareLink({
      message,
      custom_id: customId,
      referrer_id: referrerId,
    });
    setHasPressedSend(true);
    setDidSend(success);
  };

  return (
    <div style={{padding: 32}}>
      <p> Message: </p>
      <input
        type="text"
        value={message}
        onChange={handleMessageChange}
        placeholder="Type a message to include with the link"
        style={{ width: '400px', padding: '8px' }}
      />
      <br/>
      <p> Custom ID: </p>
      <input
        type="text"
        value={customId}
        onChange={handleCustomIdChange}
        placeholder="What's your custom ID?"
        style={{ width: '400px', padding: '8px' }}
      />
      <br/>
      <p> Referrer ID: </p>
      <input
        type="text"
        value={referrerId}
        onChange={handleReferrerIdChange}
        placeholder="What's your referrer ID?"
        style={{ width: '400px', padding: '8px' }}
      />
      <br/>

      <button onClick={doShareLink}>Click to Share this Link!</button>
      { hasPressedSend ? (didSend ? (<p> Succesfully shared! </p>) : (<p> Did not share </p>)) : null }
    </div>
  );
}

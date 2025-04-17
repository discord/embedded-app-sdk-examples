import React from 'react';
import discordSdk from '../discordSdk';
import {DiscordAPI, RequestType} from '../DiscordAPI';
import {authStore} from '../stores/authStore';

import brickPugLife from '../../assets/brick-pug-life.gif';

async function getImageBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function QuickLink() {
  const applicationId = import.meta.env.VITE_APPLICATION_ID;
  const [title, setTitle] = React.useState<string>('Baby Brick');
  const [description, setDescription] = React.useState<string>('I\'m small but mighty...just like a Brick!');
  const [customId, setCustomId] = React.useState<string | undefined >(undefined);

  const [hasPressedSend, setHasPressedSend] = React.useState<boolean>(false);
  const [didSend, setDidSend] = React.useState<boolean>(false);

  const handleTitleChange= (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const handleDescriptionChange= (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };
  const handleCustomIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomId(event.target.value);
  };

  const auth = authStore.getState();

  const doShareLink = async () => {
    const image = await getImageBase64(brickPugLife);

    // Generate the quick activity link
    const {link_id} = await DiscordAPI.request<{link_id: string}>(
      {
        method: RequestType.POST,
        endpoint: `/applications/${applicationId}/quick-links/`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          custom_id: customId,
          description,
          image,
          title,
        },
        stringifyBody: true,
      },
      auth.access_token,
    );

    // Open the Share modal with the generated link
    const {success} = await discordSdk.commands.shareLink({
      message: 'Come try out new features!',
      link_id: link_id
    });

    setHasPressedSend(true);
    setDidSend(success);
  };

  return (
    <div style={{padding: 32}}>
      <p> Title: </p>
      <input
        value={title}
        onChange={handleTitleChange}
        placeholder="Type a title for the embed"
        style={{ width: '400px', padding: '8px' }}
      />
      <br/>

      <p> Description: </p>
      <textarea
        value={description}
        onChange={handleDescriptionChange}
        placeholder="Type a description for the embed"
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
      <br/>

      <p>
        Clicking the button will generate a quick link and open the share link dialog
      </p>

      <button onClick={doShareLink}>Click to Share</button>
      { hasPressedSend ? (didSend ? (<p> Succesfully shared! </p>) : (<p> Did not share </p>)) : null }
    </div>
  );
}

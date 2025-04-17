import React from 'react';
import discordSdk from '../discordSdk';
import {DiscordAPI, RequestType} from '../DiscordAPI';
import {authStore} from '../stores/authStore';

function arrayBufferToString(maybeBuffer: ArrayBuffer | string): string {
  return typeof maybeBuffer === 'string' ? maybeBuffer : new TextDecoder().decode(maybeBuffer);
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (ev) => {
      if (ev.target == null) {
        return;
      }
      const {result} = ev.target;
      if (result == null || result === '') {
        return;
      }
      const imageString = arrayBufferToString(result);
      resolve(imageString);
    };
    reader.onerror = (error) => reject(error);
  });
}

export default function QuickLink() {
  const applicationId = import.meta.env.VITE_APPLICATION_ID;
  const [title, setTitle] = React.useState<string>('Baby Brick');
  const [description, setDescription] = React.useState<string>('I\'m small but mighty...just like a Brick!');
  const [customId, setCustomId] = React.useState<string | undefined >(undefined);
  const [image, setImage] = React.useState<string | undefined>();

  const [hasPressedSend, setHasPressedSend] = React.useState<boolean>(false);
  const [didSend, setDidSend] = React.useState<boolean>(false);

  const inputImageRef = React.useRef<HTMLInputElement>(null);

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file == null) {
      return;
    }
    const image = await fileToBase64(file);
    setImage(image);
  };

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
      <p> Image: </p>
      <input
        accept="image/jpeg, image/jpg, image/png"
        name="image"
        onChange={onImageChange}
        ref={inputImageRef}
        type="file"
      />
      <br />

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

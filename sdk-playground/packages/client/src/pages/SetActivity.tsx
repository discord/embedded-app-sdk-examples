import React from 'react';

import discordSdk from '../discordSdk';

export default function SetActivity() {
  React.useEffect(() => {
    // Grab a random image somewhere between 200 and 299
    const sizeString = (new Date().getTime() % 100).toString().padStart(2, '0');
    const fillerUrl = `https://placebear.com/2${sizeString}/2${sizeString}`;
    const now = new Date();

    discordSdk.commands.setActivity({
      activity: {
        details: `Testing setActivity at ${now.toISOString()}`,
        assets: {
          small_image: fillerUrl,
          large_image: fillerUrl,
        },
        secrets: {
          join: crypto.randomUUID(),
        },
        party: {
          id: discordSdk.instanceId,
          size: [1, 0]
        },
        timestamps: {
          start: now.getTime(),
        }
      },
    });
  }, []);

  return (
    <div style={{padding: 32}}>
      <div>
        <h1>Set Activity</h1>
      </div>
    </div>
  );
}

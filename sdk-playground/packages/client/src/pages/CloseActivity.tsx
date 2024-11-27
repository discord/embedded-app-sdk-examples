import React from 'react';

import discordSdk from '../discordSdk';
import {RPCCloseCodes} from "../../../../../../embedded-app-sdk";

export default function CloseActivity() {
    React.useEffect(() => {
        discordSdk.close(RPCCloseCodes.CLOSE_NORMAL, 'Activity closed');
    }, []);

    return (
        <div style={{padding: 32}}>
            <div>
                <h1>Close the Activity</h1>
            </div>
        </div>
    );
}

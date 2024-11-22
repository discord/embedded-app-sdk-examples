import React from 'react';
import discordSdk from '../discordSdk';
import ReactJsonView from '../components/ReactJsonView';
import {authStore} from '../stores/authStore';

export default function GetActivityInstance() {
    const [instance, setInstance] = React.useState<any | null>(null);
    const auth = authStore();

    React.useEffect(() => {
        async function update() {
            if (!auth) {
                return;
            }
            const instanceResponse = await fetch(`/api/activity-instance/${discordSdk.instanceId}`);
            setInstance(await instanceResponse.json());
        }
        update();
    }, [auth]);

    return (
        <div style={{padding: 32}}>
            <div>
                <h1>Current Validated Instance</h1>
                <br />
                <br />
                {instance ? <ReactJsonView src={instance} /> : null}
            </div>
        </div>
    );
}

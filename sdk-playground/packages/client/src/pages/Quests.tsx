import React from 'react';
import discordSdk from '../discordSdk';
import {RPCErrorCodes} from '@discord/embedded-app-sdk';

interface QuestEnrollmentStatus {
  quest_id: string;
  is_enrolled: boolean;
  enrolled_at?: string | null;
}

interface QuestEnrollmentUpdateEvent {
  quest_id: string;
  is_enrolled: boolean;
  enrolled_at: string;
}

interface QuestTimerResponse {
  success: boolean;
}

export default function Quests() {
  const [questId, setQuestId] = React.useState<string>('');
  const [message, setMessage] = React.useState<string>('Enter a Quest ID to get started');
  const [enrollmentStatus, setEnrollmentStatus] = React.useState<QuestEnrollmentStatus | null>(null);
  const [isSubscribed, setIsSubscribed] = React.useState<boolean>(false);
  const [awaitingStatus, setAwaitingStatus] = React.useState(false);
  const [awaitingTimer, setAwaitingTimer] = React.useState(false);

  const getEnrollmentStatus = async () => {
    if (!questId.trim()) {
      setMessage('Please enter a Quest ID');
      return;
    }

    try {
      setAwaitingStatus(true);
      setMessage('Getting enrollment status...');
      const response = await discordSdk.commands.getQuestEnrollmentStatus({ quest_id: questId });
      setEnrollmentStatus(response);
      setMessage(`Status retrieved: ${response.is_enrolled ? 'Enrolled' : 'Not Enrolled'}`);
    } catch (err: any) {
      const errorMessage = err.message ?? 'Unknown';
      setMessage(`Failed to get enrollment status. Reason: ${errorMessage}`);
      setEnrollmentStatus(null);
    } finally {
      setAwaitingStatus(false);
    }
  };

  const startTimer = async () => {
    if (!questId.trim()) {
      setMessage('Please enter a Quest ID');
      return;
    }

    try {
      setAwaitingTimer(true);
      setMessage('Starting quest timer...');
      const response = await discordSdk.commands.questStartTimer({ quest_id: questId });
      if (response.success) {
        setMessage('Quest timer started successfully!');
      } else {
        setMessage('Quest timer failed to start');
      }
    } catch (err: any) {
      const errorMessage = err.message ?? 'Unknown';
      setMessage(`Failed to start quest timer. Reason: ${errorMessage}`);
    } finally {
      setAwaitingTimer(false);
    }
  };

  const subscribeToUpdates = async () => {
    if (!questId.trim()) {
      setMessage('Please enter a Quest ID');
      return;
    }

    try {
      if (isSubscribed) {
        await discordSdk.unsubscribe('QUEST_ENROLLMENT_STATUS_UPDATE');
        setIsSubscribed(false);
        setMessage('Unsubscribed from quest enrollment updates');
      } else {
        await discordSdk.subscribe('QUEST_ENROLLMENT_STATUS_UPDATE', (event: QuestEnrollmentUpdateEvent) => {
          if (event.quest_id === questId) {
            setMessage(`Quest enrollment updated: ${event.is_enrolled ? 'Enrolled' : 'Not Enrolled'} at ${event.enrolled_at}`);
            setEnrollmentStatus({
              quest_id: event.quest_id,
              is_enrolled: event.is_enrolled,
              enrolled_at: event.enrolled_at,
            });
          }
        });
        setIsSubscribed(true);
        setMessage(`Subscribed to quest enrollment updates for ${questId}`);
      }
    } catch (err: any) {
      const errorMessage = err.message ?? 'Unknown';
      setMessage(`Failed to ${isSubscribed ? 'unsubscribe from' : 'subscribe to'} quest updates. Reason: ${errorMessage}`);
    }
  };

  return (
    <div style={{padding: 32}}>
      <h1>Quests</h1>
      <h2>{message}</h2>
      
      <div style={{marginBottom: 16}}>
        <label htmlFor="questId">Quest ID: </label>
        <input
          id="questId"
          type="text"
          value={questId}
          onChange={(e) => setQuestId(e.target.value)}
          placeholder="Enter quest ID"
          style={{marginLeft: 8, padding: 4}}
        />
      </div>

      <div style={{marginBottom: 16}}>
        <button 
          onClick={getEnrollmentStatus}
          disabled={awaitingStatus || !questId.trim()}
          style={{marginRight: 8}}
        >
          {awaitingStatus ? 'Getting Status...' : 'Get Enrollment Status'}
        </button>
        
        <button 
          onClick={startTimer}
          disabled={awaitingTimer || !questId.trim()}
          style={{marginRight: 8}}
        >
          {awaitingTimer ? 'Starting Timer...' : 'Start Timer'}
        </button>
        
        <button 
          onClick={subscribeToUpdates}
          disabled={!questId.trim()}
        >
          {isSubscribed ? 'Unsubscribe from Updates' : 'Subscribe to Updates'}
        </button>
      </div>

      {enrollmentStatus && (
        <div style={{marginTop: 16}}>
          <h3>Enrollment Status:</h3>
          <pre>{JSON.stringify(enrollmentStatus, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
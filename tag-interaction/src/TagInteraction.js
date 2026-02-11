import React, {useState} from 'react';
import RemoteComponentWrapper from 'customer_site/RemoteComponentWrapper';
import {useRemoteParams} from 'customer_site/useRemoteParams';
import {useAgent, dataProvider} from 'customer_site/hooks';

const FONT = '"Roboto", "Helvetica", "Arial", sans-serif';

const styles = {
  container: {
    padding: 20,
    fontFamily: FONT,
  },
  heading: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: 16,
    color: '#333',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: 6,
    fontSize: '0.9rem',
    fontFamily: FONT,
    outline: 'none',
    flex: 1,
    minWidth: 0,
  },
  button: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: 6,
    fontSize: '0.9rem',
    fontFamily: FONT,
    fontWeight: 600,
    cursor: 'pointer',
    color: '#fff',
    background: '#1976d2',
    flexShrink: 0,
  },
  value: {
    padding: '8px 12px',
    background: '#f5f5f5',
    borderRadius: 6,
    fontSize: '0.9rem',
    fontFamily: 'monospace',
    color: '#333',
    flex: 1,
    minWidth: 0,
    minHeight: 18,
    wordBreak: 'break-all',
  },
  divider: {
    borderTop: '1px solid #eee',
    margin: '16px 0',
  },
  error: {
    color: '#d32f2f',
    fontSize: '0.85rem',
    marginTop: 4,
  },
  success: {
    color: '#2e7d32',
    fontSize: '0.85rem',
    marginTop: 4,
  },
};


// ── Inner component ─────────────────────────────────────────────────

function TagInteractionInner({ agent, agentId, ui_element_props }) {
  const [getTagName, setGetTagName] = useState('');
  const [getTagResult, setGetTagResult] = useState(null);
  const [getError, setGetError] = useState(null);

  const [setTagName, setSetTagName] = useState('');
  const [setTagValue, setSetTagValue] = useState('');
  const [setStatus, setSetStatus] = useState(null);
  const [setError, setSetError] = useState(null);

  const handleGet = async () => {
    if (!getTagName.trim()) return;
    setGetError(null);
    setGetTagResult(null);
    try {
      const ch = await dataProvider.getChannel({
        agentId,
        channelName: 'tag_values',
      });
      console.log('[TagInteraction] getChannel response:', JSON.stringify(ch, null, 2));
      console.log('[TagInteraction] ch.data:', ch.data);
      console.log('[TagInteraction] ch.aggregate:', ch.aggregate);
      console.log('[TagInteraction] ch.aggregate?.data:', ch.aggregate?.data);
      const data = ch.aggregate?.data || {};
      console.log('[TagInteraction] resolved data:', data);
      const value = data[getTagName.trim()];
      console.log('[TagInteraction] tag lookup:', getTagName.trim(), '->', value);
      if (value === undefined) {
        setGetTagResult('Not found');
      } else {
        setGetTagResult(JSON.stringify(value));
      }
    } catch (err) {
      console.error('[TagInteraction] getChannel error:', err);
      setGetError(err.message || 'Failed to read tag');
    }
  };

  const handleSet = async () => {
    if (!setTagName.trim()) return;
    setSetError(null);
    setSetStatus(null);
    try {
      let parsedValue;
      try {
        parsedValue = JSON.parse(setTagValue);
      } catch {
        parsedValue = setTagValue;
      }
      await dataProvider.updateAggregate(
        { agentId, channelName: 'tag_values' },
        { [setTagName.trim()]: parsedValue },
      );
      setSetStatus('Tag set successfully');
    } catch (err) {
      setSetError(err.message || 'Failed to set tag');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.heading}>
        Get Tag
      </div>
      <div style={styles.row}>
        <input
          style={styles.input}
          placeholder="Tag name"
          value={getTagName}
          onChange={e => setGetTagName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleGet()}
        />
        <button style={styles.button} onClick={handleGet}>Get</button>
        <div style={styles.value}>
          {getTagResult ?? '\u00A0'}
        </div>
      </div>
      {getError && <div style={styles.error}>{getError}</div>}

      <div style={styles.divider} />

      <div style={styles.heading}>
        Set Tag
      </div>
      <div style={styles.row}>
        <input
          style={styles.input}
          placeholder="Tag name"
          value={setTagName}
          onChange={e => setSetTagName(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Tag value"
          value={setTagValue}
          onChange={e => setSetTagValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSet()}
        />
        <button style={styles.button} onClick={handleSet}>Set</button>
      </div>
      {setError && <div style={styles.error}>{setError}</div>}
      {setStatus && <div style={styles.success}>{setStatus}</div>}
    </div>
  );
}


// ── Hooks wrapper ───────────────────────────────────────────────────

function TagInteractionWithAgent(props) {
  const {agentId} = useRemoteParams();
  const {agent} = useAgent(agentId);

  if (!agent) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        color: '#888',
        fontFamily: FONT,
      }}>
        Loading...
      </div>
    );
  }

  return <TagInteractionInner agent={agent} agentId={agentId} {...props} />;
}


// ── RemoteComponentWrapper (outermost) ──────────────────────────────

export default function TagInteraction(props) {
  return (
    <RemoteComponentWrapper>
      <TagInteractionWithAgent {...props} />
    </RemoteComponentWrapper>
  );
}

import React, { useEffect } from 'react';

const JoinOnlinePage: React.FC = () => {
  useEffect(() => {
    // Redirect to Teams meeting link after 2 seconds
    const timer = setTimeout(() => {
      window.location.href = 'https://events.teams.microsoft.com/event/7c70a709-6543-4246-a0e2-fd8f3a9eeb34@756ec360-665c-4b24-806c-8829b04252d3';
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Redirecting to Teams Meeting...</h1>
        <p>If you are not redirected automatically, please click <a href="https://events.teams.microsoft.com/event/7c70a709-6543-4246-a0e2-fd8f3a9eeb34@756ec360-665c-4b24-806c-8829b04252d3">here</a>.</p>
      </div>
    </div>
  );
};

export default JoinOnlinePage;

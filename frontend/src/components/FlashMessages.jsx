import { useLayoutEffect, useState } from 'react';

import './FlashMessages.css';

let nextId = 0;

function FlashMessages() {
    const [messages, setMessages] = useState([]);

    useLayoutEffect(() => {
        function handleFlash(event) {
            const id = ++nextId;
            const message = {
                id,
                message: event.detail.message,
                type: event.detail.type
            };

            setMessages(current => [...current, message]);
            window.setTimeout(() => {
                setMessages(current => current.filter(item => item.id !== id));
            }, 4500);
        }

        window.addEventListener('app:flash', handleFlash);
        return () => window.removeEventListener('app:flash', handleFlash);
    }, []);

    function dismiss(id) {
        setMessages(current => current.filter(message => message.id !== id));
    }

    return (
        <div className="flash-container" aria-live="polite" aria-atomic="false">
            {messages.map(({ id, message, type }) => (
                <div key={id} className={`flash-message flash-${type}`} role={type === 'error' ? 'alert' : 'status'}>
                    <span>{message}</span>
                    <button type="button" onClick={() => dismiss(id)} aria-label="Fechar notificação">
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
}

export default FlashMessages;

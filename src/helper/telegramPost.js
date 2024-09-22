import React, { useEffect } from 'react';

export const TelegramEmbedLoader = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?15";
    script.setAttribute('data-dark', '1');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

import { useEffect } from 'react';

export const parseTextWithLinks = (text) => {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const youtubePattern = /https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  const instagramPattern = /https?:\/\/(www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+\/?/;
  const telegramPattern = /https?:\/\/(www\.)?t\.me\/[A-Za-z0-9_-]+\/\d+/; // Новый шаблон для Telegram
  const parts = text.split(urlPattern);

  return parts.map((part, index) => {
    if (urlPattern.test(part)) {
      if (youtubePattern.test(part)) {
        const videoId = part.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)[1];
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;

        return (
          <iframe
            key={index}
            src={embedUrl}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        );
      } else if (instagramPattern.test(part)) {
        return (
          <div className="instagram-container" key={index}>
          <span> © instagram </span>
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={part}
              data-instgrm-version="15"
              data-dark="1"
            ></blockquote>
          </div>
        );
      } else if (telegramPattern.test(part)) {  // Обработка Telegram ссылок
        const match = part.match(/t\.me\/([A-Za-z0-9_-]+\/\d+)/);
        const embedUrl = match ? match[1] : '';

        return (
          <div className="telegram-container">
         <span> © telegram </span>
          <blockquote
            className="telegram-post"
            data-telegram-post={embedUrl}
            data-dark="1"
            key={index}
          >
            
          </blockquote>
          
          </div>
        );
      } else {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        );
      }
    }


    const textParts = part.split('\n').map((textPart, textIndex) => (
      <>
        {textPart}
        {textIndex < part.split('\n').length - 1 && <br />}
      </>
    ));
    return <span key={index}>{textParts}</span>;
  });
};

export const parseTextWithLinks = (text) => {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const youtubePattern = /https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/;
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
      } else {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        );
      }
    }
    // Handle new lines by splitting part by newline character and rendering <br />
    const textParts = part.split('\n').map((textPart, textIndex) => (
      <>
        {textPart}
        {textIndex < part.split('\n').length - 1 && <br />}
      </>
    ));
    return <span key={index}>{textParts}</span>;
  });
};
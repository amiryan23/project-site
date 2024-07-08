
export const isWithin24Hours = (timeAdded) => {
  const millisecondsIn24Hours = 24 * 60 * 60 * 1000; 
  
  if (timeAdded) {
    const timeAddedDate = new Date(timeAdded); // Создаем объект Date из строки в формате ISO 8601
    const currentTime = new Date(); // Текущее время в локальной временной зоне

    const timeDifference = currentTime - timeAddedDate; // Разница во времени в миллисекундах

    return timeDifference < millisecondsIn24Hours;
  }

  return false;
};
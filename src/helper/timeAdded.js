

export const isWithin24Hours = (timeAdded) => {
  const millisecondsIn24Hours = 24 * 60 * 60 * 1000; 
  if(timeAdded){
  const [date, time] = timeAdded?.split(', ');
  const [day, month, year] = date?.split('.');

  const formattedDate = `${year}-${month}-${day}T${time}`;

  const timeAddedDate = new Date(formattedDate); 
  const currentTime = new Date(); 

  const timeDifference = currentTime - timeAddedDate;

  // console.log(`timeAdded: ${timeAdded}, formattedDate: ${formattedDate}, timeDifference: ${timeDifference}, isWithin24Hours: ${timeDifference < millisecondsIn24Hours}`);

  return timeDifference < millisecondsIn24Hours;
}
};
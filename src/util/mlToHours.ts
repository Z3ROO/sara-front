export function mlToHours(milliseconds:number): {hours:number, minutes:number} {
  const oneHour = 3600000;
  const oneMinute = 60000;
  const hours = Math.floor(milliseconds/oneHour);
  const minutes = Math.floor(milliseconds%oneHour / oneMinute);
  return {hours, minutes};
}
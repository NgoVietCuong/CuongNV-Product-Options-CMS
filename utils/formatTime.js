export default function formatMongoDateTime(mongoDateTime) {
    const date = new Date(mongoDateTime)
    const dateOptions = { month: '2-digit', day: '2-digit',  year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
  
    const dateString = date.toLocaleDateString('en-GB', dateOptions);
    const timeString = date.toLocaleTimeString('en-US', timeOptions);
  
    return `${dateString}, ${timeString}`;
}
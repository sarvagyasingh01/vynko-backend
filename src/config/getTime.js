export const getIstTime = () => {
    let d = new Date();
    let utc = d.getTime() + d.getTimezoneOffset() * 60000;
    let nd = new Date(utc + 3600000 * 5.5);
  
    // Get day, month, and year
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    let date = nd.toLocaleDateString("en-US", options);
  
    // Get time
    let time = nd.toLocaleTimeString("en-US");
  
    return { time, date: new Date(date).toDateString() };
  };
  
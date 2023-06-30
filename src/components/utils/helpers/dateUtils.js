export function formatDuration(isoDuration) {
  const matches = isoDuration.match(/P(\d+D)?T?(\d+H)?(\d+M)?/);

  if (!matches) {
    throw new Error(`Invalid duration format: ${isoDuration}`);
  }

  let days = 0;
  let hours = 0;
  let minutes = 0;

  if (matches[1]) {
    days = parseInt(matches[1].slice(0, -1)); // trim the "D"
  }

  if (matches[2]) {
    hours = parseInt(matches[2].slice(0, -1)); // trim the "H"
  }

  if (matches[3]) {
    minutes = parseInt(matches[3].slice(0, -1)); // trim the "M"
  }

  // Convert days to hours
  hours += days * 24;

  return `${hours}h ${minutes}m`;
}

// NEEDS WORK
export function formatDatetoDateMonth(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  const day = date.getDate();
  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    date
  );
  return `${day} ${month}`;
}

// Format dateTimeString to time 00:00
export function formatToTime(dateTimeString) {
  const dateObj = new Date(dateTimeString);
  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Format dateTimeString to date 00 Jan
function formatToDate(dateTimeString) {
  const dateObj = new Date(dateTimeString);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString("default", { month: "short" });
  return `${day} ${month}`;
}

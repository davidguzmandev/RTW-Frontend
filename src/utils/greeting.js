import moment from "moment"; // Time extension

export const greeting = () => {
    const timeRanges = [
        {start:5, end: 12, label: 'morning'},
        {start:12, end: 18, label: 'afternoon'},
        {start:18, end: 24, label: 'evening'},
        {start:0, end: 5, label: 'night'},
    ];

    // Obtener la hora con moment
    const currentHour = moment().hour();

    const timeOfDay = timeRanges.find( range =>
        currentHour >= range.start && currentHour < range.end
    )?.label;

    return `Good ${timeOfDay}`
}
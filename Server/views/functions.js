function formatDate(dateTime) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    return new Date(dateTime).toLocaleString('en-US', options);
}

function calculateStatus(startTime) {
    const currentDateTime = new Date();
    const sessionStartTime = new Date(startTime);

    if (currentDateTime > sessionStartTime) {
        return 'Over';
    } else {
        return 'Active';
    }
}
module.exports = {formatDate,calculateStatus}

function resData(time) {
    console.log(time.toString());
    const hour = time.getHours();
    let res = "";
    if (hour >= 6 && hour <= 12) {
        res = "Hi it's Morning in Bharat";
    }
    if (hour > 12 && hour <= 16) {
        res = "Hi it's Noon in Bharat";
    }
    if (hour > 16 && hour <= 20) {
        res = "Hi it's Evening in Bharat";
    }
    if ((hour > 20 && hour <= 23) || (hour >= 20 && hour < 6)) {
        res = "Hi it's Night in Bharat";
    }
    console
    return res;
}

module.exports = resData;
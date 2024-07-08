 function isJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Haversine 
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // radius of earth (meter)
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1); 

    const m = Math.sin(dLat / 2) * Math.sin(dLat / 2);
    const n = Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const a = Number(m) + Number(n);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meter
}


function calculateSpeed(distance, timeInSeconds) {
    // return distance / timeInSeconds;
     var Speedm = distance / timeInSeconds;
     return (Speedm * 3600) /1000;
}


if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition(function(position) {
    const { latitude, longitude } = position.coords; 
    const timestamp = parseInt(Date.now()/1000);
    var distance = 0;
    var speed = 0;
    $("#liveLocation").html("Latitude: "+latitude+"  Longitude: "+longitude);

    var previous = $("#previousPosition").val();
    if (isJSON(previous)) {
        var previousPosition = JSON.parse(previous);
        const timeInSeconds = (timestamp - previousPosition.timestamp);

        const lat1 = previousPosition.latitude;
        const lon1 = previousPosition.longitude;
        const lat2 = latitude;
        const lon2 = longitude;

        var distance = haversineDistance(lat1, lon1, lat2, lon2);
        if (timeInSeconds > 0) {
        var speed = calculateSpeed(distance, timeInSeconds);
        }

        //console.log(`Distance: ${distance.toFixed(2)} meters`);
        $("#speed").html(`Speed: ${speed.toFixed(2)} KM/h`);
    }


    $("#previousPosition").val(`{"latitude":"${latitude}","longitude":"${longitude}","timestamp":"${timestamp}"}`);
    }, function(error) {
        console.log('Unable to retrieve location');
     }, {
       enableHighAccuracy: true,
       maximumAge: 0
    });
}
else {
  console.log('Geolocation is not supported by this browser.');
}
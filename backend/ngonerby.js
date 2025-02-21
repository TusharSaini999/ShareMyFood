const db = require("./db"); 


const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};


const findNearbyNGOs = async (lat, lon) => {
    let radius = 30; 
    let NGOs = [];

    const query = 'SELECT * FROM ngo';

    return new Promise((resolve, reject) => {
        db.query(query, (err, ngos) => {
            if (err) {
                return reject("Error fetching NGOs from the database: " + err);
            }

            let foundNGOs = [];

            
            for (const ngo of ngos) {
                let distance = calculateDistance(lat, lon, ngo.latitude, ngo.longitude);
                if (distance <= radius && ngo.status === "online") {
                    ngo.distance = distance;
                    foundNGOs.push(ngo);
                }
            }

            
            while (foundNGOs.length === 0 && radius <= 400) {
                radius *= 2;

                for (const ngo of ngos) {
                    let distance = calculateDistance(lat, lon, ngo.latitude, ngo.longitude);
                    if (distance <= radius && ngo.status === "online") {
                        ngo.distance = distance;
                        foundNGOs.push(ngo);
                    }
                }
            }

            
            foundNGOs.sort((a, b) => a.distance - b.distance);

            if (foundNGOs.length > 0) {
                resolve(foundNGOs);
            } else {
                reject("No online NGOs found within the extended search radius");
            }
        });
    });
};

module.exports = { calculateDistance, findNearbyNGOs };

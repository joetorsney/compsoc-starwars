const columns = [
    "pl_name",
    "pl_discmethod",
    "pl_pnum",
    "pl_orbper",
    "pl_orbsmax",
    "pl_orbeccen",
    "pl_orbincl",
    "pl_bmassj",
    "pl_radj",
    "st_dist",
    "st_teff",
    "pl_disc",
    "pl_facility",
    "pl_pelink",
    "pl_edelink"
]

const G = 6.67408e-11;
const JUPITER_MASS_KG = 1.898e+27; 
const JUPITER_RADIUS_M = 69911000;

export const nasaurl = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select="
    + columns.join(",") 

/**
 * Converts the exoplanet data to a matrix, where each
 * row i in the matrix corresponds to the exoplanet at row i in
 * the original data. The new matrix rows only contains values for
 * orbital period, Jupiter mass, and Jupiter Radius.
 * @param {Array} data 
 */
export function buildExoMatrix(data) {
    // Take the 3, 7, and 8th indices from each row as Numbers.
    return data.map(d => [d[3], d[7], d[8]].map(e => Number(e)))
    
}

/**
 * Returns an array representing the star wars planet so
 * that it can be converted.
 * @param {Object} swp // The star wars planet object.
 */
export function swPlanetToArray(swp) {
    let g = 9.81; // gravitational field strength
    let r_m = swp.diameter*1000/2 // planet radius in metres
    let r_j = r_m / JUPITER_RADIUS_M // planet radius in Jupters

    // planet mass in Jupiters
    // See Muncaster, p77
    let m_kg = g * (Math.pow(r_m, 2)) / G
    let m_j = m_kg / JUPITER_MASS_KG 

    return [Number(swp.orbital_period), m_j, r_j]
}

/**
 * Returns the indices of the 5 closest matching exoplanents
 * to the given starwars planet. (Euclidean distance)
 * This is super slow (using arrays) and should really be using
 * something like numjs, or mathjs for matrix algebra. Neither of
 * these librares were as easy to work with as numpy.
 * 
 * (Even with 4500 exoplanets it's still fast enough :))
 * @param {*} swplanet 
 * @param {*} exoplanets 
 */
export function matchPlanets(swplanet, exoplanets) {
    let D = []; // D[i] is the distance from swplanet to exoplanets[i]

    for (let i = 0; i < exoplanets.length; i++) {
        let e = exoplanets[i]
        D[i] = Math.sqrt(
            Math.pow((e[0] - swplanet[0]), 2) +
            Math.pow((e[1] - swplanet[1]), 2) +
            Math.pow((e[2] - swplanet[2]), 2)
        );
    }
    
    return D;
}
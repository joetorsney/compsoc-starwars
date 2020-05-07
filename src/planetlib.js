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
    console.log(m_kg)
    let m_j = m_kg / JUPITER_MASS_KG 

    console.log()

    return [swp.orbital_period, m_j, r_j]
}

/**
 * Returns the indices of the 5 closest matching exoplanents
 * to the given starwars planet.
 * @param {*} swplanet 
 * @param {*} exoplanets 
 */
export function matchPlanets(swplanet, exoplanets) {
    console.log(swplanet, exoplanets);
    return [0, 1, 2]
}
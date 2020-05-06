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

export const nasaurl = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select="
    + columns.join(",") 
    

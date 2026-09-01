// Teams
const TEAMS_BY_DIVISION = {
  569: {
    // T-TH mixed
    6505: true,
    6506: true,
    6507: true,
    6508: true, // Kirby's dreamland
    6509: true,
    6510: true,
    6511: true,
    6529: true,
  },
  568: {
    // M-W mixed
    6500: true,
    6497: true,
    6499: true,
    6501: true,
    6503: true,
    6496: true,
    6502: true,
    6498: true,
  },
  567: {
    // TH mixed
    6553: true,
    6550: true,
    6546: true,
    6549: true,
    6552: true,
    6548: true,
    6551: true,
    6547: true,
  },
  566: {
    // T mixed
    6538: true,
    6541: true,
    6540: true,
    6544: true,
    6545: true,
    6539: true,
    6543: true,
    6542: true,
  },
  565: {
    // M night open
    6554: true,
    6557: true,
    6556: true,
    6555: true,
  },
  564: {
    // M early mixed
    6531: true,
    6534: true,
    6530: true,
    6536: true,
    6532: true,
    6533: true,
    6537: true,
    6535: true,
  },
  563: {
    // Su MMP
    6560: true,
    6559: true,
    6561: true,
    6558: true,
    6563: true,
    6562: true,
  },
  562: {
    // Su FMP
    6574: true,
    6572: true,
    6573: true,
    6570: true,
    6571: true,
    6575: true,
  },
};

const SEASON_NAME = "MUFA 2026 Fall";

// Error handling
const MAX_RUNTIME_MS = 5 * 60 * 1000; // App scripts have a max runtime of 6 min. Stop at 5.
let CREATED_ONE_TIME_TRIGGER = false;

// Site scraping
const TABLE_REGEX =
  /<table class="rgMasterTable"[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/g;
const ROW_REGEX = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
const CELL_REGEX = /<td[^>]*>([\s\S]*?)<\/td>/g;
const DIAGRAM_ANCHOR_REGEX = /<a [^>]*>Diagram<\/a>/;
const TEAM_NAME_REGEX = /id="cpMain_cpMain_lblTeamName">([\s\S]*?)<\//;

// Config
const MY_EMAIL = "mufagamescalendar@gmail.com";
let debugMode = false;
let excludePastEvents = true;

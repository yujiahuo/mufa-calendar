// Teams
const teamsByDivision = {
  554: [
    6371, 6419, 6376, 6365, 6380, 6359, 6372, 6374, 6394, 6378, 6442, 6363,
    6401, 6383, 6405, 6414, 6356, 6395, 6400, 6406, 6412, 6381, 6417, 6379,
    6410, 6386, 6413, 6454, 6366, 6387, 6393, 6436, 6458, 6399, 6443, 6373,
    6420, 6449,
  ],
};

// Timer
const MAX_RUNTIME_MS = 5 * 60 * 1000; // App scripts have a max runtime of 6 min. Stop at 5.
const CREATED_ONE_TIME_TRIGGER = false;

// Site scraping
const TABLE_REGEX =
  /<table class="rgMasterTable"[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/;
const ROW_REGEX = /<tr[\S\s]*?>([\s\S]*?)<\/tr>/g; // TODO: use [^>]* here
const CELL_REGEX = /<td[^>]*>([\s\S]*?)<\/td>/g;
const DIAGRAM_ANCHOR_REGEX = /<a [^>]*>Diagram<\/a>/;
const TEAM_NAME_REGEX = /id="cpMain_cpMain_lblTeamName">([\s\S]*?)<\//;

// Logistics
const MY_EMAIL = "mufagamescalendar@gmail.com";

// Teams
const teamsByDivision = {
  554: [
    6371, 6419, 6376, 6365, 6380, 6359, 6372, 6374, 6394, 6378, 6442, 6363,
    6401, 6383, 6405, 6414, 6356, 6395, 6400, 6406, 6412, 6381, 6417, 6379,
    6410, 6386, 6413, 6454, 6366, 6387, 6393, 6436, 6458, 6399, 6443, 6373,
    6420, 6449,
  ],
  555: [
    6397, 6444, 6424, 6375, 6362, 6369, 6434, 6392, 6402, 6463, 6439, 6423,
    6429, 6457, 6452, 6421, 6472, 6460, 6427, 6391, 6453, 6428, 6385, 6358,
    6470, 6388, 6435, 6384, 6462, 6461, 6438, 6411, 6409, 6407, 6382, 6418,
    6440, 6367, 6403, 6430, 6433, 6389, 6450, 6377, 6398, 6404, 6416, 6432,
    6422, 6459, 6370, 6441, 6364, 6396, 6456, 6455, 6360, 6425, 6451, 6361,
    6471, 6390,
  ],
};

// Timer
const MAX_RUNTIME_MS = 5 * 60 * 1000; // App scripts have a max runtime of 6 min. Stop at 5.
let CREATED_ONE_TIME_TRIGGER = false;

// Site scraping
const TABLE_REGEX =
  /<table class="rgMasterTable"[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/;
const ROW_REGEX = /<tr[\S\s]*?>([\s\S]*?)<\/tr>/g; // TODO: use [^>]* here
const CELL_REGEX = /<td[^>]*>([\s\S]*?)<\/td>/g;
const DIAGRAM_ANCHOR_REGEX = /<a [^>]*>Diagram<\/a>/;
const TEAM_NAME_REGEX = /id="cpMain_cpMain_lblTeamName">([\s\S]*?)<\//;

// Logistics
const MY_EMAIL = "mufagamescalendar@gmail.com";

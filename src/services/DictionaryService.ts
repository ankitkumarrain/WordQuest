/**
 * DictionaryService provides offline dictionary lookup for Bonus Words.
 * If a player drags a valid English word not present in the level targets,
 * they receive a Bonus Word reward (+5 coins)!
 */

// Curated high-frequency English vocabulary words (3-8 letters)
const COMMON_DICTIONARY_WORDS = new Set([
  // 3 letters
  'ACE', 'ACT', 'ADD', 'AGE', 'AGO', 'AID', 'AIM', 'AIR', 'ALL', 'AND', 'ANT', 'ANY', 'APE', 'ARC', 'ARM', 'ART',
  'ASH', 'ASK', 'AWE', 'AXE', 'BAD', 'BAG', 'BAN', 'BAR', 'BAT', 'BAY', 'BED', 'BEE', 'BEG', 'BET', 'BID', 'BIG',
  'BIN', 'BIT', 'BOB', 'BOW', 'BOX', 'BOY', 'BUG', 'BUS', 'BUT', 'BUY', 'BYE', 'CAB', 'CAN', 'CAP', 'CAR', 'CAT',
  'COW', 'CRY', 'CUP', 'CUT', 'DAD', 'DAM', 'DAY', 'DEN', 'DEW', 'DIG', 'DIM', 'DIP', 'DOG', 'DOT', 'DRY', 'DUE',
  'EAR', 'EAT', 'EGG', 'EGO', 'ELK', 'ELM', 'END', 'ERA', 'EVE', 'EYE', 'FAN', 'FAR', 'FAT', 'FEE', 'FEW', 'FIG',
  'FIT', 'FIX', 'FLY', 'FOG', 'FOR', 'FOX', 'FRY', 'FUN', 'FUR', 'GAP', 'GAS', 'GEL', 'GEM', 'GET', 'GIG', 'GIN',
  'GLAD', 'GNU', 'GOD', 'GOT', 'GUM', 'GUN', 'GUT', 'GUY', 'GYM', 'HAD', 'HAM', 'HAS', 'HAT', 'HAY', 'HEM', 'HEN',
  'HER', 'HEY', 'HID', 'HIM', 'HIP', 'HIS', 'HIT', 'HOG', 'HOP', 'HOT', 'HOW', 'HUB', 'HUE', 'HUG', 'HUM', 'HUT',
  'ICE', 'ICY', 'ILL', 'INK', 'INN', 'ION', 'IRE', 'IVY', 'JAB', 'JAM', 'JAR', 'JAW', 'JAY', 'JET', 'JIG', 'JOB',
  'JOG', 'JOY', 'JUG', 'KEY', 'KID', 'KIN', 'KIT', 'LAB', 'LAD', 'LAP', 'LAW', 'LAY', 'LED', 'LEG', 'LET', 'LID',
  'LIE', 'LIP', 'LIT', 'LOG', 'LOT', 'LOW', 'MAD', 'MAN', 'MAP', 'MAT', 'MAY', 'MEN', 'MET', 'MUD', 'MUG', 'MUM',
  'NAP', 'NET', 'NEW', 'NIL', 'NOD', 'NOT', 'NOW', 'NUT', 'OAK', 'OAR', 'OAT', 'ODD', 'OFF', 'OIL', 'OLD', 'ONE',
  'OPT', 'ORB', 'ORE', 'OUR', 'OUT', 'OWL', 'OWN', 'PAD', 'PAN', 'PAR', 'PAT', 'PAW', 'PAY', 'PEA', 'PEG', 'PEN',
  'PET', 'PIE', 'PIG', 'PIN', 'PIT', 'POD', 'POP', 'POT', 'PRO', 'PUP', 'RAD', 'RAG', 'RAM', 'RAN', 'RAP', 'RAT',
  'RAW', 'RAY', 'RED', 'RIB', 'RID', 'RIM', 'RIP', 'ROB', 'ROD', 'ROW', 'RUB', 'RUG', 'RUN', 'RUT', 'RYE', 'SAD',
  'SAG', 'SAP', 'SAW', 'SAY', 'SEA', 'SET', 'SEW', 'SHE', 'SHY', 'SIN', 'SIP', 'SIR', 'SIT', 'SIX', 'SKI', 'SKY',
  'SLY', 'SOB', 'SON', 'SOW', 'SOY', 'SPA', 'SPY', 'SUM', 'SUN', 'TAB', 'TAG', 'TAN', 'TAP', 'TAR', 'TAX', 'TEA',
  'TEN', 'THE', 'TIE', 'TIN', 'TIP', 'TOE', 'TON', 'TOP', 'TOW', 'TOY', 'TUB', 'TUG', 'TWO', 'URN', 'USE', 'VAN',
  'VAT', 'VET', 'VIA', 'VOW', 'WAR', 'WAX', 'WAY', 'WEB', 'WET', 'WHO', 'WHY', 'WIG', 'WIN', 'WIT', 'WOE', 'WON',
  'YAK', 'YAM', 'YAP', 'YAW', 'YEA', 'YES', 'YET', 'YEW', 'ZIP', 'ZOO',

  // 4 letters
  'ABLE', 'ACHE', 'ACID', 'ACRE', 'AGED', 'AIDE', 'ALLY', 'ALMS', 'ALOE', 'ALSO', 'ALTO', 'AMEN', 'AMID', 'ANEW',
  'ARCH', 'AREA', 'ARMY', 'ATOM', 'AUNT', 'AUTO', 'AVID', 'AWAY', 'BABY', 'BACK', 'BAKE', 'BALL', 'BAND', 'BANK',
  'BARE', 'BARK', 'BARN', 'BASE', 'BATH', 'BEAK', 'BEAM', 'BEAN', 'BEAR', 'BEAT', 'BEEF', 'BEER', 'BELL', 'BELT',
  'BEND', 'BEST', 'BIKE', 'BILL', 'BIND', 'BIRD', 'BITE', 'BLOW', 'BLUE', 'BOAT', 'BODY', 'BOIL', 'BOLD', 'BOLT',
  'BOND', 'BONE', 'BOOK', 'BOOM', 'BORN', 'BOSS', 'BOWL', 'BUSH', 'BUSY', 'CAGE', 'CAKE', 'CALM', 'CAMP', 'CARD',
  'CARE', 'CART', 'CASE', 'CASH', 'CAST', 'CAVE', 'CELL', 'CHAT', 'CHEF', 'CHIN', 'CHIP', 'CITY', 'CLAP', 'CLAW',
  'CLAY', 'CLIP', 'CLUB', 'CLUE', 'COAL', 'COAT', 'CODE', 'COIN', 'COLD', 'COLT', 'COMB', 'COME', 'COOK', 'COOL',
  'COPE', 'COPY', 'CORD', 'CORE', 'CORN', 'COST', 'CRAB', 'CROP', 'CROW', 'CURE', 'CURL', 'DARK', 'DART', 'DASH',
  'DATA', 'DATE', 'DAWN', 'DEAF', 'DEAL', 'DEAR', 'DECK', 'DEED', 'DEEP', 'DEER', 'DESK', 'DIAL', 'DIRT', 'DIVE',
  'DOCK', 'DOME', 'DOOR', 'DOSE', 'DOVE', 'DOWN', 'DRAW', 'DROP', 'DRUM', 'DUCK', 'DUST', 'DUTY', 'EACH', 'EARN',
  'EAST', 'EASY', 'EDGE', 'EVEN', 'EVER', 'EVIL', 'EXAM', 'EXIT', 'FACE', 'FACT', 'FAIR', 'FALL', 'FAME', 'FARM',
  'FAST', 'FATE', 'FEAR', 'FEAT', 'FEED', 'FEEL', 'FEET', 'FELL', 'FERN', 'FILE', 'FILL', 'FILM', 'FIND', 'FINE',
  'FIRE', 'FIRM', 'FISH', 'FIST', 'FLAG', 'FLAT', 'FLEE', 'FLEW', 'FLOW', 'FOAM', 'FOLK', 'FOOD', 'FOOL', 'FOOT',
  'FORD', 'FORK', 'FORM', 'FORT', 'FOUL', 'FOUR', 'FREE', 'FROG', 'FROM', 'FUEL', 'FULL', 'FUND', 'FURY', 'GAIN',
  'GALE', 'GAME', 'GATE', 'GEAR', 'GIFT', 'GIRL', 'GLAD', 'GLOW', 'GOAL', 'GOAT', 'GOLD', 'GOLF', 'GOOD', 'GRAB',
  'GRID', 'GRIN', 'GRIP', 'GROW', 'GULF', 'HAIL', 'HAIR', 'HALF', 'HALL', 'HALT', 'HAND', 'HANG', 'HARD', 'HARE',
  'HARM', 'HATE', 'HAVE', 'HAWK', 'HEAD', 'HEAL', 'HEAP', 'HEAR', 'HEAT', 'HEEL', 'HEIR', 'HELM', 'HELP', 'HERB',
  'HERD', 'HERO', 'HIDE', 'HIGH', 'HIKE', 'HILL', 'HINT', 'HIRE', 'HOLD', 'HOLE', 'HOLY', 'HOME', 'HOOD', 'HOOK',
  'HOPE', 'HORN', 'HOSE', 'HOST', 'HOUR', 'HUGE', 'HULL', 'HUNT', 'HURT', 'ICON', 'IDEA', 'IDLE', 'INCH', 'IRON',
  'ITEM', 'JADE', 'JAIL', 'JAZZ', 'JOIN', 'JOKE', 'JOLT', 'JUMP', 'JUNE', 'JURY', 'JUST', 'KEEN', 'KEEP', 'KELP',
  'KICK', 'KILL', 'KIND', 'KING', 'KISS', 'KITE', 'KNEE', 'KNOT', 'KNOW', 'LACE', 'LACK', 'LADY', 'LAIR', 'LAKE',
  'LAMB', 'LAMP', 'LAND', 'LANE', 'LAST', 'LATE', 'LAVA', 'LEAD', 'LEAF', 'LEAP', 'LEFT', 'LEND', 'LENS', 'LILY',
  'LIME', 'LINE', 'LINK', 'LION', 'LIPS', 'LIST', 'LIVE', 'LOAD', 'LOAF', 'LOAN', 'LOCK', 'LONG', 'LOOK', 'LOOP',
  'LORD', 'LOSE', 'LOSS', 'LOUD', 'LOVE', 'LUCK', 'LUNG', 'LUSH', 'MADE', 'MAID', 'MAIL', 'MAIN', 'MAKE', 'MALL',
  'MANY', 'MARK', 'MASK', 'MAST', 'MATE', 'MEAL', 'MEAN', 'MEAT', 'MEET', 'MELT', 'MEND', 'MENU', 'MILD', 'MILE',
  'MILK', 'MILL', 'MIND', 'MINE', 'MINT', 'MIST', 'MOAN', 'MODE', 'MOLE', 'MOON', 'MORE', 'MOSS', 'MOST', 'MOTH',
  'MOVE', 'MULE', 'NAME', 'NAVY', 'NEAR', 'NEAT', 'NECK', 'NEED', 'NEST', 'NEWS', 'NEXT', 'NICE', 'NINE', 'NODE',
  'NOON', 'NORM', 'NOSE', 'NOTE', 'OAKY', 'OATH', 'OBEY', 'ODOR', 'OMEN', 'ONCE', 'ONLY', 'ONTO', 'OPEN', 'ORAL',
  'OVAL', 'OVEN', 'OVER', 'PACE', 'PACK', 'PAGE', 'PAID', 'PAIN', 'PAIR', 'PALE', 'PALM', 'PARK', 'PART', 'PASS',
  'PAST', 'PATH', 'PEAK', 'PEAR', 'PEEK', 'PEER', 'PELT', 'PICK', 'PIKE', 'PILE', 'PILL', 'PINE', 'PINK', 'PINT',
  'PIPE', 'PITY', 'PLAN', 'PLAY', 'PLEA', 'PLOT', 'PLUG', 'PLUM', 'POEM', 'POET', 'POLE', 'POND', 'PONY', 'POOL',
  'POOR', 'PORK', 'PORT', 'POSE', 'POST', 'POUR', 'PRAY', 'PULL', 'PUMP', 'PURE', 'PUSH', 'RACE', 'RACK', 'RAFT',
  'RAGE', 'RAID', 'RAIL', 'RAIN', 'RARE', 'RASH', 'RATE', 'RAVE', 'READ', 'REAL', 'REAP', 'REAR', 'REED', 'REEF',
  'REEL', 'REST', 'RICE', 'RICH', 'RIDE', 'RING', 'RIOT', 'RIPE', 'RISE', 'RISK', 'ROAD', 'ROAR', 'ROBE', 'ROCK',
  'RODE', 'ROLL', 'ROOF', 'ROOM', 'ROOT', 'ROPE', 'ROSE', 'RUBY', 'RUIN', 'RULE', 'RUSH', 'RUST', 'SAFE', 'SAGE',
  'SAIL', 'SALT', 'SAME', 'SAND', 'SAVE', 'SCAN', 'SEAL', 'SEAM', 'SEAT', 'SEED', 'SEEK', 'SEEN', 'SEND', 'SHED',
  'SHIN', 'SHIP', 'SHOE', 'SHOP', 'SHOT', 'SHOW', 'SHUT', 'SICK', 'SIDE', 'SIGH', 'SIGN', 'SILK', 'SILO', 'SING',
  'SINK', 'SITE', 'SIZE', 'SKIN', 'SLAB', 'SLAM', 'SLAP', 'SLID', 'SLIM', 'SLIP', 'SLOT', 'SLOW', 'SNAP', 'SNOW',
  'SOAP', 'SOAR', 'SOCK', 'SOFA', 'SOIL', 'SOLO', 'SONG', 'SOON', 'SORE', 'SOUL', 'SOUP', 'SOUR', 'SPIN', 'SPIT',
  'SPOT', 'SPUR', 'STAR', 'STAY', 'STEM', 'STEP', 'STEW', 'STOP', 'SUCH', 'SUIT', 'SURE', 'SURF', 'SWAN', 'SWIM',
  'TAIL', 'TAKE', 'TALE', 'TALK', 'TALL', 'TANK', 'TAPE', 'TASK', 'TEAM', 'TEAR', 'TELL', 'TENT', 'TERM', 'TEST',
  'TEXT', 'THAT', 'THEN', 'THEY', 'THIN', 'THIS', 'TIDE', 'TIDY', 'TIED', 'TILE', 'TILL', 'TIME', 'TINY', 'TOAD',
  'TOLL', 'TONE', 'TOOK', 'TOOL', 'TORN', 'TOSS', 'TOUR', 'TOWN', 'TRAP', 'TRAY', 'TREE', 'TRIP', 'TRUE', 'TUBE',
  'TUNE', 'TURF', 'TURN', 'TWIN', 'TYPE', 'UNIT', 'UPON', 'URGE', 'VAIN', 'VALE', 'VARY', 'VAST', 'VEIL', 'VEIN',
  'VENT', 'VERB', 'VERY', 'VEST', 'VIEW', 'VINE', 'VOID', 'VOLT', 'VOTE', 'WADE', 'WAGE', 'WAIT', 'WAKE', 'WALK',
  'WALL', 'WANT', 'WARD', 'WARM', 'WARN', 'WASH', 'WASP', 'WAVE', 'WEAK', 'WEAR', 'WEED', 'WEEK', 'WELL', 'WENT',
  'WEST', 'WHAT', 'WHEN', 'WIDE', 'WILD', 'WILL', 'WIND', 'WINE', 'WING', 'WINK', 'WIPE', 'WIRE', 'WISE', 'WISH',
  'WITH', 'WOLF', 'WOOD', 'WOOL', 'WORD', 'WORE', 'WORK', 'WORM', 'YARD', 'YARN', 'YEAR', 'YOGA', 'YOKE', 'ZEST', 'ZONE',

  // 5+ letters common words
  'ABOUT', 'ABOVE', 'ACROSS', 'ACTION', 'ACTIVE', 'ACTOR', 'ADVICE', 'AFRAID', 'AFTER', 'AGAIN', 'AGENT', 'AGILE',
  'AGREE', 'AHEAD', 'ALBUM', 'ALERT', 'ALIEN', 'ALIVE', 'ALLOW', 'ALONE', 'ALONG', 'ALPHA', 'ALTER', 'AMONG',
  'ANGEL', 'ANGER', 'ANGLE', 'ANIMAL', 'ANSWER', 'APART', 'APPLE', 'APPLY', 'APRIL', 'ARENA', 'ARGUE', 'ARISE',
  'ARROW', 'ASIDE', 'ASSET', 'AUDIO', 'AUDIT', 'AVOID', 'AWAIT', 'AWAKE', 'AWARD', 'AWARE', 'BADGE', 'BAKER',
  'BASIC', 'BASIS', 'BEACH', 'BEAST', 'BEGIN', 'BEING', 'BELOW', 'BENCH', 'BERRY', 'BIRTH', 'BLACK', 'BLADE',
  'BLAME', 'BLANK', 'BLAST', 'BLAZE', 'BLEND', 'BLESS', 'BLIND', 'BLOCK', 'BLOOD', 'BLOOM', 'BOARD', 'BOAST',
  'BONUS', 'BOOST', 'BOUND', 'BRAIN', 'BRAKE', 'BRAND', 'BRASS', 'BRAVE', 'BREAD', 'BREAK', 'BRICK', 'BRIDE',
  'BRIEF', 'BRIGHT', 'BRING', 'BROAD', 'BROKE', 'BROOK', 'BROOM', 'BROWN', 'BRUSH', 'BUILD', 'BUNCH', 'BURST',
  'CABIN', 'CABLE', 'CAMEL', 'CANAL', 'CANDY', 'CANOE', 'CANYON', 'CAPITAL', 'CARPET', 'CARROT', 'CASTLE',
  'CATER', 'CAUSE', 'CEASE', 'CEDAR', 'CHAIN', 'CHAIR', 'CHALK', 'CHAMP', 'CHANCE', 'CHANGE', 'CHANNEL',
  'CHARM', 'CHART', 'CHASE', 'CHEAP', 'CHECK', 'CHEEK', 'CHEER', 'CHEST', 'CHIEF', 'CHILD', 'CHILI', 'CHILL',
  'CHORD', 'CHOSE', 'CHUTE', 'CIDER', 'CIGAR', 'CIRCLE', 'CIVIL', 'CLAIM', 'CLASS', 'CLEAN', 'CLEAR', 'CLERK',
  'CLICK', 'CLIFF', 'CLIMB', 'CLOAK', 'CLOCK', 'CLOSE', 'CLOTH', 'CLOUD', 'CLOVER', 'COAST', 'COBRA', 'COLOR',
  'COMET', 'COMIC', 'CORAL', 'COUNT', 'COURT', 'COVER', 'CRACK', 'CRAFT', 'CRANE', 'CRASH', 'CRATE', 'CRAZY',
  'CREAM', 'CREEK', 'CREST', 'CRIME', 'CRISP', 'CROSS', 'CROWD', 'CROWN', 'CRUSH', 'CRYSTAL', 'CUBIC', 'CURVE',
  'CYCLE', 'DAILY', 'DAIRY', 'DAISY', 'DANCE', 'DANGER', 'DEATH', 'DEBUG', 'DECAY', 'DECOR', 'DELAY', 'DELTA',
  'DEMON', 'DENSE', 'DEPTH', 'DESERT', 'DESIGN', 'DEVICE', 'DEVIL', 'DIARY', 'DINER', 'DISCO', 'DIVIDE', 'DODGE',
  'DONOR', 'DOUBT', 'DRAFT', 'DRAIN', 'DREAM', 'DRESS', 'DRIFT', 'DRILL', 'DRINK', 'DRIVE', 'DRONE', 'EAGLE',
  'EARTH', 'ECLIPSE', 'ELDER', 'ELEMENT', 'EMERALD', 'EMPTY', 'ENERGY', 'ENGINE', 'ENJOY', 'ENTER', 'ENTRY',
  'EQUAL', 'EQUIP', 'ERROR', 'ESCAPE', 'ESSAY', 'ETHIC', 'EVENT', 'EXACT', 'EXIST', 'EXTRA', 'FABLE', 'FAITH',
  'FALCON', 'FALSE', 'FANCY', 'FEAST', 'FIBER', 'FIELD', 'FIFTH', 'FIGHT', 'FINAL', 'FINCH', 'FLAME', 'FLASH',
  'FLASK', 'FLEET', 'FLOAT', 'FLOCK', 'FLOOD', 'FLOOR', 'FLORA', 'FLOUR', 'FLUTE', 'FOCUS', 'FORCE', 'FOREST',
  'FORGE', 'FORUM', 'FOUND', 'FOUNT', 'FRAME', 'FRESH', 'FRONT', 'FROST', 'FRUIT', 'FUSION', 'FUTURE', 'GALAXY',
  'GARDEN', 'GARLIC', 'GEAR', 'GEYSER', 'GHOST', 'GIANT', 'GLADE', 'GLASS', 'GLOBE', 'GLORY', 'GLOVE', 'GOLDEN',
  'GRACE', 'GRADE', 'GRAIN', 'GRAND', 'GRAPE', 'GRAPH', 'GRASP', 'GRASS', 'GRAVE', 'GRAVY', 'GREAT', 'GREEN',
  'GRIEF', 'GRILL', 'GROVE', 'GUARD', 'GUEST', 'GUIDE', 'GUILD', 'GUITAR', 'HABIT', 'HARBOR', 'HAVEN', 'HEART',
  'HONEY', 'HORSE', 'HOTEL', 'HOUSE', 'HUMAN', 'IMAGE', 'INDEX', 'INNER', 'INPUT', 'ISLAND', 'ISSUE', 'JEWEL',
  'JOURNEY', 'JUDGE', 'JUICE', 'KNIFE', 'KNIGHT', 'LABOR', 'LASER', 'LAYER', 'LEMON', 'LEVEL', 'LIGHT', 'LIMIT',
  'LIZARD', 'MAGIC', 'MAJOR', 'MANGO', 'MARBLE', 'MARKET', 'MASTER', 'MATCH', 'MEDAL', 'METAL', 'METEOR', 'MICRO',
  'MODEL', 'MONEY', 'MONTH', 'MOTOR', 'MOUNT', 'MOUSE', 'MUSIC', 'NATURE', 'NEBULA', 'NINJA', 'NOBLE', 'NORTH',
  'NOVEL', 'NURSE', 'OCEAN', 'OCTAVE', 'OLIVE', 'ONION', 'OPERA', 'ORBIT', 'ORCHID', 'ORDER', 'ORGAN', 'OXYGEN',
  'PANDA', 'PANEL', 'PANIC', 'PARK', 'PARROT', 'PARTY', 'PEACE', 'PEACH', 'PEARL', 'PHOENIX', 'PHOTO', 'PILOT',
  'PIVOT', 'PIXEL', 'PIZZA', 'PLANET', 'PLANT', 'PLATE', 'PLAZA', 'POETRY', 'POINT', 'POLAR', 'PORTAL', 'POTATO',
  'POWER', 'PRICE', 'PRIDE', 'PRIME', 'PRIZE', 'PULSE', 'PUPPY', 'PUZZLE', 'PYRAMID', 'QUEEN', 'QUEST', 'QUICK',
  'QUIET', 'RADAR', 'RADIO', 'RAINBOW', 'RANCH', 'RANGE', 'RIVER', 'ROBOT', 'ROCKET', 'ROUND', 'ROYAL', 'RUBY',
  'SAFARI', 'SAILOR', 'SALAD', 'SAUCE', 'SCALE', 'SCENE', 'SCOUT', 'SECRET', 'SHADOW', 'SHARK', 'SHELL', 'SHIELD',
  'SIGNAL', 'SILVER', 'SIREN', 'SKILL', 'SMART', 'SMILE', 'SNAKE', 'SOLAR', 'SOUND', 'SPACE', 'SPARK', 'SPEED',
  'SPHERE', 'SPIDER', 'SPIRIT', 'SPRING', 'SQUARE', 'STAGE', 'STAR', 'STEAM', 'STEEL', 'STONE', 'STORM', 'STORY',
  'STREAM', 'STREET', 'STUDY', 'SUGAR', 'SUMMER', 'SWORD', 'SYMBOL', 'SYSTEM', 'TABLE', 'TARGET', 'TEMPLE',
  'TENNIS', 'THEORY', 'TIGER', 'TIMBER', 'TIMER', 'TITAN', 'TOAST', 'TOWER', 'TRACK', 'TRAIN', 'TRAVEL', 'TREASURE',
  'TROPHY', 'TRUCK', 'TULIP', 'TUNNEL', 'TURTLE', 'VALLEY', 'VALOR', 'VAPOR', 'VELVET', 'VICTORY', 'VILLAGE',
  'VIOLET', 'VISION', 'VOICE', 'VOLCANO', 'VOYAGE', 'WALNUT', 'WATER', 'WAVE', 'WHEAT', 'WHEEL', 'WIND', 'WINTER',
  'WISDOM', 'WIZARD', 'WONDER', 'WORLD', 'YACHT', 'YELLOW', 'ZEBRA', 'ZENITH', 'ZEPHYR'
]);

export class DictionaryService {
  /**
   * Checks if an uppercase candidate word is a recognized valid English word.
   */
  static isValidWord(word: string): boolean {
    if (!word || word.length < 3) return false;
    const upper = word.toUpperCase().trim();
    return COMMON_DICTIONARY_WORDS.has(upper);
  }

  /**
   * Checks forward and reversed form of dragged string.
   * Returns canonical valid word if found, or null.
   */
  static checkBonusCandidate(rawSelection: string): string | null {
    if (!rawSelection || rawSelection.length < 3) return null;
    const forward = rawSelection.toUpperCase();
    if (this.isValidWord(forward)) return forward;
    const reversed = forward.split('').reverse().join('');
    if (this.isValidWord(reversed)) return reversed;
    return null;
  }
}

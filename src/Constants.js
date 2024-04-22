const CONSTANTS = {
  WEB_CLIENT_ID:
    '932238780865-ceef9pejfkcau41gquokgbh6sre52td1.apps.googleusercontent.com',
  ANDROID_ID:
    '932238780865-4bvrueob6d0qmb480t7ak7n28u7umr0h.apps.googleusercontent.com',
  IOS_ID:
    '932238780865-kb0aqjrtmrc5tgq9k29ptnhfjloqec3n.apps.googleusercontent.com',

  //APP Internal control

  IS_BACKGROUND_HIDE: true,
  IS_IOS_IN_APP_PURCHASE_TEST: true,
  //TYPE
  SIGN_IN_WITH_FACEBOOK: 'facebook',
  SING_IN_WITH_GOOGLE: 'google',
  SING_IN_WITH_APPLE: 'apple',

  DEFAULT_DATE_FORMAT: 'dd/mm/yyyy',
  DEFAULT_TIME_FORMAT: '12-hour',

  //ASYNC STORAGE KEY
  //Profile
  PROFILE_STATUS: 'profile_status',
  //Settings
  IS_BIO_REQUIRED: 'is_bio_required',
  IS_BIO_EANBLED: 'is_bio_login_enabled',
  //SignIn
  USER_TOKEN: 'user_token',
  USER_ID: 'user_id',
  USER_EMAIL: 'user_email',
  SIGN_IN_METHOD: 'sign_in_method',
  SETTING: 'setting',
  DATE_FORMAT: 'date_format',

  LOGIN_METHOD: 'Login_Email',
  LOGIN_PASS: 'Login_Pass',
  //Signup
  //USER_ID: 'user_id',
  //USER_EMAIL: 'user_email',
  //SIGN_IN_METHOD: 'sign_in_method',
  //PROFILE_STATUS: 'profile_status',
  //USER_ID: 'user_id',
  //Settings,
  //DATE_FORMAT: 'date_format',
  TIME_FORMAT: 'time_format',
  //Theme Provider
  CURRENT_THEME_NAME: 'currentThemeName',
  CURRENT_THEME: 'currentTheme',
  //Account
  TOKEN_KEY: 'TokenKey',

  SELECTED_PLAN_ID: 'selectedPlanId',
  SELECTED_PLAN_PRICE: 'selectedPlanPrice',

  //Theme Provider
  CURRENT_BG_NAME: 'currentBgName',
  CURRENT_BG_TYPE: 'currentBgType',
  CURRENT_BG: 'currentBg',

  UNREAD_COUNT: 'unreadCount',

  NDA_STATUS: {
    COMPLETED: 'complete',
  },

  API_KEY: {
    USER_EMAIL: 'user_email',
  },

  //Seetings background names
  BG_IMG: {
    HONEYCOMB: 'HoneycombBg',
    ELEGENT: 'ElegantBg',

    ABSTRACT_BLUE: 'abstractBlue', //'ShushLadyBg',
    ABSTRACT_GREY: 'abstractGrey',
    FLARE: 'flare', //DarkCloud
    DRAGON: 'dragonBg',
    FIREWORK: 'FireworkBg',
    WAVE: 'WaveBg',
    COLOR_SHIFT: 'ColorShiftBg',
    FLAREGOLD: 'flareGoldVideo',
    FLAREROSEGOLD: 'flareRoseGoldVideo',

    DARK_GOLD: 'darkGold',
    PEARL: 'pearlbg',
    SPARK: 'sparkbg',
    FLOWER: 'flowerbg',
    WATER_DROP: 'WaterDropBg',
    DEFAULT: 'DefaultBg',

    //Video BG
    PINK_FLARE: 'pinkFlareVideoBg',
    GOLD_FLARE: 'goldFlareVideoBg',
    BLUE_FLARE: 'blueFlareVideoBg',
  },

  UI: {

    //Current theme
    PINK_FLARE: 'pinkFlare',
    BLUE_FLARE: 'blueFlare',
    GOLD_FLARE: 'goldFlare',

    GOLD_FLOWER: 'goldFlower',
    GOLD_PEARL: 'goldPearl',
    GOLD_WATER_DROP: 'goldWaterDrop',

    DEFAULT: 'default',

    //Unused UI
    // LIGHT: 'light',
    // HONEYCOMB: 'honeycomb',
    // ROSEGOLD: 'roseGold',
    // GOLD: 'gold',
    // ELEGENT: 'elegant',

    // ROSE_GOLD_PEARL: 'roseGoldPearl',
    // ROSE_GOLD_SPARK: 'roseGoldSpark',
    // ROSE_GOLD_FLOWER: 'roseGoldFlower',
    // ROSE_GOLD_DARK: 'roseGoldDark',
    // GOLD_SPARK: 'goldSpark',

    // GOLD_DARK: 'goldDark',
    // ELEGENT_WATER_DROP: 'elegantWaterDrop',
  },

  HTTP_STATUS_CODE: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    GATEWAY_TIMEOUT: 504,
  }
  //Settings Theme names
};

module.exports = CONSTANTS;


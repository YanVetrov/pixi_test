let defaultAction = {
  ur: { x: 105, y: 30, angle: 50 },
  r: { x: 140, y: 60, angle: 100 },
  dr: { x: 130, y: 90, angle: 100 },
  u: { x: 55, y: 25, angle: 0 },

  ul: { x: 10, y: 50, angle: -50 },
  l: { x: 0, y: 95, angle: -100 },
  dl: { x: 0, y: 130, angle: -100 },
  d: { x: 85, y: 130, angle: 180 },
  repeat: 3,
  scale: 0.3,
  speed: 0.5,
  diffX: -105,
  diffY: -55,
  textures: ["fire1.png", "fire2.png", "fire.png"],
  throw: true,
  crash: ["crash.png", "crash1.png", "crash2.png"],
};
let base = [
  {
    id: 126335,
    name: "skunk",
    type: "battle",
    locked: false,
    unlockedTime: 0,
    inGame: false,
    image: "skunk",
    shards: null,
    shardCode: "SHS",
    shardCount: 10,
    nftCount: 1,
    discountEnabled: false,
    discountTypeEnabled: false,
    load: true,
    lvl: 4,
    repairing: false,
    diffX: 50,
    diffY: -30,
    mechShard: 7,
    size: 150,
    action: {
      ur: { x: 200, y: -140, angle: 50 },
      r: { x: 320, y: 25, angle: 100 },
      dr: { x: 300, y: 120, angle: 120 },
      u: { x: 10, y: -200, angle: 0 },
      ul: { x: -160, y: -55, angle: -50 },
      l: { x: -180, y: 140, angle: -100 },
      dl: { x: -110, y: 210, angle: -120 },
      d: { x: 110, y: 270, angle: 180 },
      repeat: 1,
      scale: 0.6,
      speed: 0.2,
      diffX: -105,
      diffY: -85,
      textures: ["skunk_fire/1.png", "skunk_fire/2.png", "skunk_fire/3.png"],
      throw: false,
      crash: ["skunk_fire/skunk_crash.png"],
    },
  },
  {
    id: 126336,
    name: "raccoon",
    type: "battle",
    locked: false,
    unlockedTime: 0,
    inGame: false,
    image: "raccoon",
    shards: null,
    nftCount: 1,
    shardCode: "SHR",
    shardCount: 10,
    discountEnabled: false,
    discountTypeEnabled: false,
    load: true,
    lvl: 3,
    repairing: false,
    diffX: 50,
    diffY: -30,
    mechShard: 10,
    size: 150,
    action: {
      ur: { x: 80, y: 25, angle: 50 },
      r: { x: 90, y: 45, angle: 100 },
      dr: { x: 90, y: 70, angle: 100 },
      u: { x: 50, y: 15, angle: 0 },

      ul: { x: 10, y: 25, angle: -50 },
      l: { x: 0, y: 45, angle: -100 },
      dl: { x: 0, y: 80, angle: -100 },
      d: { x: 50, y: 90, angle: 180 },
      repeat: 1,
      scale: 0.3,
      speed: 0.5,
      diffX: -105,
      diffY: -85,
      textures: ["rocket/1.png", "rocket/2.png", "rocket/3.png"],
      throw: true,
      crash: ["crash.png", "crash1.png", "crash2.png"],
    },
  },
  {
    id: 126539,
    name: "hamster",
    type: "miner",
    locked: false,
    unlockedTime: 0,
    inGame: false,
    image: "hamster",
    shards: null,
    shardCode: "SHH",
    shardCount: 3,
    nftCount: 1,
    discountEnabled: false,
    load: true,
    discountTypeEnabled: false,
    lvl: 1,
    repairing: false,
    diffX: 50,
    diffY: -30,
    mechShard: 15,
    size: 180,
  },
  {
    id: 258790,
    name: "validator",
    type: "validator",
    locked: false,
    unlockedTime: 0,
    inGame: false,
    image: "validator",
    shards: null,
    shardCode: "",
    shardCount: 0,
    nftCount: 0,
    discountEnabled: false,
    load: true,
    discountTypeEnabled: false,
    lvl: 1,
    repairing: false,
    diffX: 35,
    diffY: -60,
    mechShard: 0,
    size: 180,
    action: {
      ur: { x: 180, y: 125, angle: 50 },
      r: { x: 190, y: 145, angle: 100 },
      dr: { x: 190, y: 170, angle: 100 },
      u: { x: 150, y: 115, angle: 0 },

      ul: { x: 110, y: 125, angle: -50 },
      l: { x: 100, y: 145, angle: -100 },
      dl: { x: 100, y: 180, angle: -100 },
      d: { x: 150, y: 190, angle: 180 },
      repeat: 1,
      scale: 0.3,
      speed: 0.5,
      diffX: -105,
      diffY: -85,
      textures: ["rocket/1.png", "rocket/2.png", "rocket/3.png"],
      throw: true,
      crash: ["crash.png", "crash1.png", "crash2.png"],
    },
  },
  {
    id: 126334,
    name: "ant",
    type: "battle",
    locked: false,
    unlockedTime: 0,
    inGame: false,
    image: "ant",
    shards: null,
    shardCode: "SHA",
    nftCount: 1,
    shardCount: 10,
    discountEnabled: false,
    load: true,
    discountTypeEnabled: false,
    lvl: 5,
    repairing: false,
    diffX: 60,
    diffY: -30,
    mechShard: 6,
    size: 130,
    action: {
      ur: { x: 150, y: -120, angle: 50 },
      r: { x: 250, y: 15, angle: 100 },
      dr: { x: 250, y: 20, angle: 100 },
      u: { x: 10, y: -150, angle: 0 },

      ul: { x: -120, y: -75, angle: -50 },
      l: { x: -100, y: 100, angle: -100 },
      dl: { x: -120, y: 100, angle: -100 },
      d: { x: 110, y: 250, angle: 180 },
      repeat: 1,
      scale: 0.6,
      speed: 0.2,
      diffX: -105,
      diffY: -85,
      textures: ["ant_fire/1.png", "ant_fire/2.png", "ant_fire/3.png"],
      throw: false,
      crash: ["crash.png", "crash1.png", "crash2.png"],
    },
  },
  {
    id: 126341,
    name: "elephantor",
    type: "battle",
    locked: false,
    unlockedTime: 0,
    inGame: false,
    image: "elephantor",
    shards: null,
    shardCode: "SHE",
    shardCount: 10,
    nftCount: 1,
    discountEnabled: false,
    load: true,
    discountTypeEnabled: false,
    lvl: 2,
    repairing: false,
    diffX: 50,
    diffY: -30,
    mechShard: 14,
    size: 180,
    action: {
      ur: { x: 80, y: 25, angle: 50 },
      r: { x: 90, y: 45, angle: 100 },
      dr: { x: 90, y: 70, angle: 100 },
      u: { x: 50, y: 15, angle: 0 },

      ul: { x: 10, y: 25, angle: -50 },
      l: { x: 0, y: 45, angle: -100 },
      dl: { x: 0, y: 80, angle: -100 },
      d: { x: 50, y: 90, angle: 180 },
      repeat: 1,
      scale: 0.2,
      speed: 0.4,
      diffX: -105,
      diffY: -85,
      textures: ["rocket/1.png", "rocket/2.png", "rocket/3.png"],
      throw: true,
      crash: ["crash.png", "crash1.png", "crash2.png"],
    },
  },
  {
    id: 339760,
    name: "pumpkin elephantor",
    type: "battle",
    locked: false,
    unlockedTime: 0,
    inGame: false,
    image: "pumpkin_elephantor",
    shards: null,
    shardCode: "SHE",
    shardCount: 10,
    nftCount: 1,
    discountEnabled: false,
    load: true,
    discountTypeEnabled: false,
    lvl: 2,
    repairing: false,
    diffX: 50,
    diffY: -30,
    mechShard: 14,
    size: 180,
    action: {
      ur: { x: 80, y: 25, angle: 50 },
      r: { x: 90, y: 45, angle: 100 },
      dr: { x: 90, y: 70, angle: 100 },
      u: { x: 50, y: 15, angle: 0 },

      ul: { x: 10, y: 25, angle: -50 },
      l: { x: 0, y: 45, angle: -100 },
      dl: { x: 0, y: 80, angle: -100 },
      d: { x: 50, y: 90, angle: 180 },
      repeat: 1,
      scale: 0.2,
      speed: 0.4,
      diffX: -105,
      diffY: -85,
      textures: ["rocket/1.png", "rocket/2.png", "rocket/3.png"],
      throw: true,
      crash: ["crash.png", "crash1.png", "crash2.png"],
    },
  },
  {
    id: 126332,
    name: "wolf",
    type: "battle",
    locked: false,
    unlockedTime: 0,
    inGame: false,
    image: "wolf",
    shards: null,
    shardCode: "SHW",
    shardCount: 10,
    nftCount: 1,
    discountEnabled: false,
    load: true,
    discountTypeEnabled: false,
    lvl: 6,
    repairing: false,
    mechShard: 4,
    size: 120,
    action: defaultAction,
  },
  {
    id: 289548,
    name: "trilobit",
    type: "battle",
    locked: false,
    unlockedTime: 0,
    inGame: false,
    image: "trilobit",
    shardCode: "",
    lvl: 6,
    repairing: false,
    mechShard: 0,
    diffX: 50,
    diffY: -20,
    size: 170,
    action: defaultAction,
    monster: true,
  },
  // {
  //   id: 1263399,
  //   name: "wolf2",
  //   type: "battle",
  //   locked: false,
  //   unlockedTime: 0,
  //   inGame: false,
  //   image: "wolf2",
  //   shards: null,
  //   shardCode: "SHW",
  //   nftCount: 1,
  //   discountEnabled: false,
  //   load: true,
  //   hp: 430,
  //   strength: 600,
  //   discountTypeEnabled: false,
  //   lvl: 6,
  //   repairing: false,
  //   action: defaultAction,
  // },
  // {
  //   id: 126332,
  //   name: "validator",
  //   type: "validator",
  //   locked: false,
  //   unlockedTime: 0,
  //   inGame: false,
  //   image: "validator",
  //   shards: null,
  //   shardCode: "SHV",
  //   hp: 1,
  //   strength: 1,
  //   nftCount: 1,
  //   discountEnabled: false,
  //   load: true,
  //   discountTypeEnabled: false,
  //   lvl: 7,
  //   repairing: false,
  //   diffX: 25,
  //   diffY: -60,
  // },
];
export default base;

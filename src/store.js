import {
  Sprite,
  Texture,
  Container,
  Text,
  Graphics,
  AnimatedSprite,
} from "pixi.js";
import { gsap } from "gsap";
import { generateSpinner } from "./graphics.js";
import base from "./units_templates.js";
import { ColorOverlayFilter } from "@pixi/filter-color-overlay";
import unpack_units from "./parser";
import { BevelFilter } from "@pixi/filter-bevel";
import { transaction } from "./auth.js";
const objectsOnMap = [];
let friends = localStorage.getItem("friends");
if (!friends) {
  localStorage.setItem("friends", JSON.stringify({}));
  friends = {};
} else {
  friends = JSON.parse(friends);
}
let store = {
  state: null,
  admins: {
    metalwartest: true,
  },
  npc: {
    metalwarevil: true,
  },
  friends,
  stuffGetted: false,
  unitsGetted: false,
  id: null,
  mountains: null,
  logs: [],
  bg: null,
  gameScene: null,
  target: null,
  defaultFireTimeout: 30,
  defaultMoveTimeout: 30,
  defaultMineTimeout: 600,
  defaultStuffAction: 60,
  defualtCellCost: 900,
  clicked: true,
  blockedUI: false,
  cellsInLine: 20,
  countLines: 20,
  map: [],
  allMapCount: 90000,
  miniMap: null,
  u: {},
  cash: [],
  text: {},
  visibleZone: [],
  defaultPosX: 700,
  defaultPosY: -250,
  x: -5,
  y: -5,
  user: {},
  units: [],
  unusedUnits: [],
  vue: {},
  objectsOnMap,
  getGaragesUnits({ x, y }) {
    return this.selfUnits.filter(el => el.posX === x && el.posY === y);
  },
};
Object.defineProperty(store, "unit", {
  get() {
    return this.u;
  },
  set(unit) {
    if (this.u) {
      this.u.active = false;
      this.u.interactive = false;
      this.u.buttonMode = false;
      if (this.u.ground) this.u.ground.filters = [];
    }
    if (unit) {
      unit.active = true;
      unit.buttonMode = true;
      unit.interactive = true;
      if (unit.ground)
        unit.ground.filters = [
          new BevelFilter({
            lightColor: 0xff69,
            thickness: 15,
            rotation: 0,
            shadowColor: 0xff69,
            lightAlpha: 1,
            shadowAlpha: 1,
          }),
        ];
    }
    this.u = unit;
  },
});
Object.defineProperty(store, "unusedUnits", {
  get() {
    return this.units.filter(el => el.posX === 1 && el.posY === 1);
  },
});
Object.defineProperty(store, "selfUnits", {
  get() {
    return this.units.filter(el => el.self);
  },
});
Object.defineProperty(store, "garages", {
  get() {
    return this.objectsOnMap.filter(el => el.type === "garage");
  },
});
Object.defineProperty(store, "unitsInVisibleZone", {
  get() {
    // return this.units.filter(
    //   el =>
    //     this.visibleZone.some(
    //       ground => ground.posX === el.posX && ground.posY === el.posY
    //     ) &&
    //     (!this.garages.some(
    //       ground => ground.posX === el.posX && ground.posY === el.posY
    //     ) ||
    //       el.self)
    // );
    return this.units.filter(
      el =>
        el.posX >= store.x + 1 &&
        el.posX < store.x + 1 + store.cellsInLine &&
        el.posY >= store.y + 1 &&
        el.posY < store.y + 1 + store.countLines &&
        (!this.garages.some(
          ground => ground.posX === el.posX && ground.posY === el.posY
        ) ||
          el.self)
    );
  },
});
Object.defineProperty(store, "unitsFromKeys", {
  get() {
    return this.units.reduce((acc, el) => {
      acc[el.unit.asset_id] = el;
      return acc;
    }, {});
  },
});
function createObjectOnMap(el) {
  let container = new Container();
  let sprite = Sprite.from(`./assets/${el.image}.png`);
  sprite.zIndex = 1;
  sprite.interactive = false;
  sprite.buttonMode = false;
  Object.keys(el).forEach(key => (sprite[key] = el[key]));
  Object.keys(el).forEach(key => (container[key] = el[key]));
  let str = "";
  if (el.lvl) str = `${"LVL: " + el.lvl}`;
  if (el.owner) str = `${el.owner}`;
  if (el.type === "stuff") str = el.amount;
  let text = new Text(str, {
    fill: "#009534",
    fontFamily: "metalwar",
    fontSize: 20,
    stroke: "#000",
    strokeThickness: 4,
    align: "center",
  });
  text.anchor.set(-0.2, 0);
  text.scale.x = 1 + (1 - el.scaled);
  text.scale.y = 1 + (1 - el.scaled);
  if (el.asset_id) {
    text.scale.x = 4;
    text.scale.y = 4;
  }
  container.addChild(sprite);
  container.addChild(text);
  return container;
}
function createUnits(arr, handler) {
  return arr.map((el, i) => {
    let directions = ["u", "d", "r", "l", "ur", "ul", "dl", "dr"];
    let random = Math.ceil(Math.random() * (directions.length - 1));
    let sprite = Sprite.from(
      `./assets/cards/${el.image}/${directions[random]}.png`
    );
    directions.forEach(key => {
      sprite[key] = Texture.from(`./assets/cards/${el.image}/${key}.png`);
      if (el.type !== "validator") {
        if (!sprite.broken) sprite.broken = {};
        sprite.broken[key] = Texture.from(
          `./assets/cards/${el.image}/broken/${key}.png`
        );
      }
      if (el.type === "validator") {
        sprite["stake_" + key] = Texture.from(
          `./assets/cards/${el.image}/stake_${key}.png`
        );
      }
      if (el.type === "miner") {
        sprite["mine_" + key] = Texture.from(
          `./assets/cards/${el.image}/mining/${key}.png`
        );
      }
    });

    let container = new Container();
    container.sortableChildren = true;
    generateSpinner(container);
    sprite.width = el.size || 120;
    sprite.height = el.size || 120;
    sprite.dir = "ul";
    container.posX = parseInt(el.location / 100000);
    container.posY = parseInt(el.location % 100000);
    container.diffX = el.diffX;
    container.diffY = el.diffY;
    container.type = "unit";
    Object.keys(el).forEach(key => (sprite[key] = el[key]));
    Object.defineProperty(sprite, "direction", {
      get() {
        return this.dir;
      },
      set(val) {
        if (!val) return "invalid";
        let scale = this.scale.x;
        this.dir = val;
        this.texture = this[val];
        this.scale.x = scale;
        this.scale.y = scale;
      },
    });
    container.name = el.name;
    container.locked = false;
    container.lt = 0;

    // container.timerText = new Text("", {
    //   fill: 0xefefef,
    //   fontFamily: "metalwar",
    //   fontSize: 15,
    // });

    // container.timerText.x = 70;
    // container.timerText.y = -20;
    let amount = el.stuff
      ? el.stuff.reduce((acc, el) => acc + el.amount * el.weight, 0)
      : 0;
    container.stuffCountText = new Text(`${amount}/${el.capacity}`, {
      fill: 0xefefef,
      fontFamily: "metalwar",
      fontSize: 10,
      stroke: "#454545",
      strokeThickness: 2,
    });
    container.stuffCountText.x = 30;
    container.stuffCountText.y = -3;
    container.getShards = () => ({
      type: el.shardCode,
      amount: el.shardCount,
      weight: 1,
    });
    container.hpText = new Text(`${el.hp}/${el.strength}`, {
      fill: 0xefefef,
      fontFamily: "metalwar",
      fontSize: 10,
      stroke: "#454545",
      strokeThickness: 2,
    });
    let color = el.self ? 0x00ffaa : 0xff3377;
    if (store.friends[el.owner]) color = 0x3377ff;
    if (store.npc[el.owner]) color = 0xc3c507;
    container.owner = new Text(
      `${el.owner || "Enemy"}${store.npc[el.owner] ? "[NPC]" : ""}`,
      {
        fill: color,
        fontFamily: "metalwar",
        fontSize: 15,
        stroke: "#000",
        strokeThickness: 2,
      }
    );
    container.owner.zIndex = 4;
    if (store.admins[el.owner]) container.admin = true;
    container.alphaCounter = async function(
      text = "+1",
      color = 0xeeeeee,
      delay = 0
    ) {
      let options = {
        fill: color,
        fontFamily: "metalwar",
        fontSize: 25,
      };
      if (delay) {
        options = {
          ...options,
          ...{
            align: "center",
            breakWords: true,
            padding: 16,
            trim: true,
            fontSize: 25 - text.length / 5,
            wordWrapWidth: 100,
            stroke: "#333",
            strokeThickness: 4,
          },
        };
      }
      if (text.length === 2) options.fontSize = 55;
      let node = new Text(text, options);
      node.zIndex = 12;
      this.addChild(node);
      node.x = 40;
      if (delay) {
        node.x = 40 - text.length * 1.5;
      }
      node.y = 40;
      await gsap.to(node, { y: 0, alpha: 0, duration: 2, delay });
      this.removeChild(node);
    };
    container.miningAnimation = function() {
      setTimeout(
        () => (this.unit.texture = this.unit["mine_" + this.unit.direction]),
        100
      );
      setTimeout(
        () => (this.unit.texture = this.unit[this.unit.direction]),
        300
      );
      setTimeout(
        () => (this.unit.texture = this.unit["mine_" + this.unit.direction]),
        500
      );
      setTimeout(
        () => (this.unit.texture = this.unit[this.unit.direction]),
        700
      );
      setTimeout(
        () => (this.unit.texture = this.unit["mine_" + this.unit.direction]),
        900
      );
      setTimeout(
        () => (this.unit.texture = this.unit[this.unit.direction]),
        1100
      );
    };
    container.getMoveCooldown = function() {
      return (
        Date.now() + Math.floor(store.defualtCellCost / this.unit.speed) * 1000
      );
    };
    container.hpText.x = 30;
    container.hpText.y = -3;
    let healthBar = new Container();
    healthBar.x = 50;
    healthBar.y = 20;
    container.addChild(healthBar);
    healthBar.zIndex = 3;
    let innerBar = new Graphics();
    innerBar.beginFill(0x333);
    innerBar.drawRoundedRect(0, 0, 100, 8, 30);
    innerBar.endFill();
    healthBar.addChild(innerBar);

    let outerBar = new Graphics();
    let percent = (el.hp / el.strength) * 100;
    outerBar.beginFill(percent < 30 ? 0x990000 : 0x009900);
    outerBar.drawRoundedRect(0, 0, (el.hp / el.strength) * 100, 8, 30);
    outerBar.endFill();
    healthBar.addChild(outerBar);

    healthBar.outer = outerBar;
    let capacityBar = new Container();
    capacityBar.x = 50;
    capacityBar.y = 30;
    container.addChild(capacityBar);
    capacityBar.zIndex = 3;
    let innerBar1 = new Graphics();
    innerBar1.beginFill(0x333);
    innerBar1.drawRoundedRect(0, 0, 100, 8, 30);
    innerBar1.endFill();
    capacityBar.addChild(innerBar1);

    let outerBar1 = new Graphics();
    outerBar1.beginFill(0xaba134);
    outerBar1.drawRoundedRect(
      0,
      0,
      el.stuff
        ? (el.stuff.reduce((acc, el) => acc + el.amount * el.weight, 0) /
            el.capacity) *
            100
        : 0,
      8,
      30
    );
    outerBar1.endFill();
    capacityBar.addChild(outerBar1);

    healthBar.outer = outerBar;
    container.owner.x = 50;
    container.self = el.self;
    container.unit = sprite;
    container.unit.x = -(el.size / 10);
    // container.unit.y = -(el.size/10)
    container.agr = { value: false, timeout: "" };
    container.spinner.scale.set(0.2);
    container.spinner.y = -20;
    container.spinner.x = 80;
    container.spinner.zIndex = 9;
    container.spinner.alpha = 0.5;
    // container.addChild(container.timerText);
    healthBar.addChild(container.hpText);
    container.addChild(container.owner);
    capacityBar.addChild(container.stuffCountText);
    container.addChild(sprite);
    container.healthBar = outerBar;
    container.capacityBar = outerBar1;
    if (el.self) container.on("pointerup", handler);
    // Object.defineProperty(container, "timer", {
    //   get() {
    //     return this.timerText.text;
    //   },
    //   set(val) {
    //     if (!val) val = "";
    //     this.timerText.text = val;
    //   },
    // });
    Object.defineProperty(container, "stuffCount", {
      get() {
        return this.unit.stuff
          ? this.unit.stuff.reduce((acc, el) => acc + el.amount * el.weight, 0)
          : 0;
      },
      set(val) {
        this.stuffCountText.text = `${val}/${this.unit.capacity}`;
        this.capacityBar.width = this.unit.stuff
          ? (this.unit.stuff.reduce(
              (acc, el) => acc + el.amount * el.weight,
              0
            ) /
              this.unit.capacity) *
              100 || 1
          : 1;
      },
    });
    Object.defineProperty(container, "lockedTime", {
      get() {
        return this.lt;
      },
      set(val) {
        this.lt = val;
        if (!val) {
          val = null;
          // this.timer = 0;
        }
        this.locked = !!val;
      },
    });
    container.lockedTime = el.lockedTime;
    let skunk = Sprite.from("./assets/skunk_fire/skunk_crash.png");
    skunk.scale.x = 0.6;
    skunk.scale.y = 0.6;
    skunk.x += 20;
    skunk.y += 10;
    Object.defineProperty(container, "poised", {
      get() {
        if (this.unit.poised_cnt > 0) return this.unit.poised_cnt;
        else return 0;
      },
      set(val) {
        if (val < 0 || isNaN(val)) val = 0;
        this.unit.poised_cnt = val;
        if (val === 0) {
          this.removeChild(skunk);
        } else {
          this.addChild(skunk);
        }
      },
    });
    if (container.poised) container.addChild(skunk);
    Object.defineProperty(container, "health", {
      get() {
        return this.unit.hp;
      },
      async set(val) {
        let color = 0x00ff00;
        let percent = (val / this.unit.strength) * 100;
        if (percent < 30) color = 0xff9999;
        if (this.unit.hp === 0 && val > 0) {
          this.unit.texture = this.unit[this.unit.direction];
        }
        this.healthBar.width = (val / this.unit.strength) * 100 || 1;
        this.healthBar.tint = color;
        this.unit.hp = val;
        this.hpText.text = `${val}/${this.unit.strength}`;
        if (val === 0) {
          this.unit.texture = this.unit.broken[this.unit.direction];
        }
        await gsap.to(this.hpText.scale, { x: 1.1, y: 1.1, duration: 0.1 });
        await gsap.to(this.hpText.scale, { x: 1, y: 1, duration: 0.1 });
      },
    });
    Object.defineProperty(container, "agressive", {
      get() {
        return this.agr.value;
      },
      set(val) {
        this.agr.value = !!val;
        clearTimeout(this.agr.timeout);
        if (!!val) {
          this.unit.filters = [new ColorOverlayFilter(0xee4444, 0.35)];
          this.agr.timeout = setTimeout(() => (this.agressive = false), 10000);
        } else {
          this.unit.filters = [];
        }
      },
    });
    container.stakeValidator = function() {
      if (this.locked) return 0;
      if (!this.unit.type === "validator")
        return console.log("not validator =" + this.unit.type);
      this.unit.direction = "stake_" + this.unit.direction;
      window.sound("validator");
      this.locked = true;
    };
    if (el.type === "validator") {
      container.scale.x = 1.3;
      container.scale.y = 1.3;
    }
    container.health = el.hp;
    return container;
  });
}
const units = createUnits(base);
const setExampleUnits = () => (store.units = createUnits(base));
async function getIngameTanks(
  handler,
  handlerMove,
  handlerAttack,
  handlerMine,
  handlerCollect,
  handlerDropStuff,
  handlerRepair,
  unitChanges,
  unitOnClickHandler,
  handlerTeleport,
  handlerStuff
) {
  let account = await store.user.getAccountName();
  let started = Date.now();
  let garages = await store.user.rpc.get_table_rows({
    json: true,
    code: "metalwargame",
    scope: "metalwargame",
    table: "teleports",
    limit: 100,
    reverse: true,
  });
  let anuses = await store.user.rpc.get_table_rows({
    json: true,
    code: "metalwargame",
    scope: "metalwargame",
    table: "oredeposits",
    limit: 100,
    reverse: true,
  });
  let end = Date.now();
  let ping = end - started;
  store.ping = ping;
  // let validator = base.find(el => el.type === "validator");
  // let wolf2 = base.find(el => el.name === "wolf2");
  garages.rows.forEach(el => {
    let posX = parseInt(el.location / 100000);
    let posY = parseInt(el.location % 100000);
    objectsOnMap.push(
      createObjectOnMap({
        ...el,
        name: "garage mini",
        image: el.asset_id ? "cards/validator/stake_l" : "teleport",
        posX,
        posY,
        scaled: el.asset_id ? 0.3 : 0.7,
        diffX: el.asset_id ? 10 : 15,
        diffY: el.asset_id ? -90 : -20,
        amount: el.price,
        type: "garage",
      })
    );
  });
  anuses.rows.forEach(el => {
    let posX = parseInt(el.location / 100000);
    let posY = parseInt(el.location % 100000);
    objectsOnMap.push(
      createObjectOnMap({
        name: "geyser" + el.lvl,
        image: "geyser" + el.lvl,
        posX,
        posY,
        scaled: 0.5,
        diffX: 25,
        diffY: -60,
        type: "geyser",
        lvl: el.lvl,
        amount: el.amount,
        type_id: el.type_id,
      })
    );
  });

  store.vue.store.geysers = anuses.rows.map(el => {
    let { lvl } = el;
    let posX = parseInt(el.location / 100000);
    let posY = parseInt(el.location % 100000);
    return { posX, posY, lvl };
  });
  store.vue.store.geysers.sort((a, b) => a.lvl - b.lvl);

  // [wolf2, validator].forEach(el => {
  //   (el.self = true), (el.owner = store.user.accountName);
  // });
  // store.units = createUnits([...arr, validator, wolf2]);
  // store.unit = store.units[0];
  const ws = new WebSocket("wss://game.metal-war.com/ws/");
  store.vue.store.chatWs = ws;
  ws.onopen = () => store.vue.loadings.push("websocket connected");
  ws.onmessage = async message => {
    if (typeof message.data === "object") {
      const array = new Uint8Array(await message.data.arrayBuffer());
      let units = unpack_units(array);
      if (Object.keys(units).length > 1000) {
        store.vue.loadings.push("units ready");
        let allTanks = Object.values(units);
        store.vue.store.allUnits = units;
        store.vue.store.players.all = allTanks.length;
        let arr = [];
        allTanks.forEach(el => {
          let tank = parseUnit(el);
          if (tank) arr.push(tank);
        });
        arr = arr.filter(el => {
          if (
            !store.garages.some(
              ground => ground.posX === el.x && ground.posY === el.y
            ) ||
            el.self
          )
            return true;
        });
        store.vue.store.players.onmap = arr.length;
        console.log(arr.length);
        store.units = createUnits([...arr], unitOnClickHandler);
        // store.unit = store.units[0];
        store.unitsGetted = true;
        handler();
      } else {
        let allTanks = Object.values(units);
        console.log(allTanks);
        allTanks.forEach(async el => {
          unitChanges(el);
        });
      }
    } else {
      let data = JSON.parse(message.data);
      if (data.type === "units" && data.data) {
        console.log(data);
        let allTanks = Object.values(units);
        allTanks.forEach(el => unitChanges(el));
      }
      if (data.text && data.owner) {
        store.vue.onChatMessage(data);
      }
      // if (
      //   data.type === "actions" &&
      //   data.data &&
      //   typeof data.data.forEach === "function"
      // ) {
      //   data.data.forEach(el => {
      //     let info = el;
      //     let ev = info.data;
      //     let ago = Math.ceil((Date.now() - info.ts * 1000) / 1000);
      //     let timeout = Date.now() + (store.defaultFireTimeout - ago) * 1000;
      //     if (el.name === "unitmove") {
      //       // timeout = Date.now() + (store.defaultMoveTimeout - ago) * 1000;
      //       // handlerMove({ id: ev.asset_id, x: ev.x, y: ev.y, timeout });
      //     }
      //     if (el.name === "unitmine") {
      //       timeout = Date.now() + (store.defaultMineTimeout - ago) * 1000;
      //       let geyser = store.objectsOnMap.find(
      //         el => el.posX === ev.x && el.posY === ev.y
      //       );
      //       if (!geyser) geyser = {};
      //       let amount = 60 * (geyser.lvl || 1);
      //       let multiply = 1;
      //       if (Date.now() < new Date("2021-09-04T20:15:00")) multiply = 2;
      //       amount *= multiply;
      //       handlerMine({
      //         id: ev.asset_id,
      //         timeout,
      //         amount,
      //       });
      //     }
      //     if (el.name === "unitattack") {
      //       handlerAttack({
      //         id: ev.asset_id,
      //         target_id: ev.target_id,
      //         timeout,
      //       });
      //     }
      //     if (el.name === "collectstuff") {
      //       handlerCollect({
      //         id: ev.asset_id,
      //         x: ev.x,
      //         y: ev.y,
      //       });
      //     }
      //     if (el.name === "dropstuff") {
      //       // handlerDropStuff({
      //       //   id: ev.asset_id,
      //       // });
      //     }
      //     if (el.name === "transfer" && data.data.some(el => el.data.memo)) {
      //       data.data
      //         .filter(
      //           el => el.data && el.data.memo && el.data.memo.match("repair")
      //         )
      //         .forEach(el => {
      //           let id = el.data.memo.split(":")[1];
      //           handlerRepair({ id });
      //         });
      //       data.data
      //         .filter(
      //           el => el.data && el.data.memo && el.data.memo.match("tp:")
      //         )
      //         .forEach(el => {
      //           let str = el.data.memo.split(":");
      //           let location = str[1];
      //           let ids = str.slice(2, 99);
      //           let self = el.data.from === account;
      //           handlerTeleport({ location, ids, self });
      //         });
      //     }
      //   });
      // }
      if (data.type === "stuff") {
        handlerStuff(data.data);
      }
    }
  };
}
function inlog(obj) {
  console.log(obj);
  store.logs.push(obj);
}
function parseUnit(el) {
  let tank = base.find(key => el.template_id === key.id);
  if (!tank) return null;
  let locked = el.next_availability * 1000 > Date.now();
  let lockedTime = el.next_availability * 1000;
  el.capacity *= 10;
  tank = {
    ...el,
    ...tank,
    inGame: true,
    id: el.asset_id,
    repair: Math.ceil((el.strength - el.hp) / 2),
    locked,
    lockedTime,
    self: el.owner === store.user.accountName,
  };
  return tank;
}
async function moveTransaction({ id, x, y }) {
  if (!id) return true;
  let response = await transaction({
    user: store.user,
    name: "unitmove",
    data: {
      asset_id: id,
      x,
      y,
    },
  });
  return errorHandler(response);
}
async function dropStuffTransaction({ id }) {
  if (!id) return true;
  let response = await transaction({
    user: store.user,
    name: "dropstuff",
    data: {
      asset_id: id,
    },
  });
  return errorHandler(response);
}
async function collectStuffTransaction({ id, x, y }) {
  if (!id) return true;
  let response = await transaction({
    user: store.user,
    name: "collectstuff",
    data: {
      asset_id: id,
      x,
      y,
    },
  });
  return errorHandler(response);
}
async function fireTransaction({ id, target_id }) {
  if (!id) return true;
  let response = await transaction({
    user: store.user,
    name: "unitattack",
    data: {
      asset_id: id,
      target_id,
    },
  });
  return errorHandler(response);
}
async function mineTransaction({ id, x, y }) {
  if (!id) return true;
  let response = await transaction({
    user: store.user,
    name: "unitmine",
    data: {
      asset_id: id,
      x,
      y,
    },
  });
  return errorHandler(response);
}
async function repair({ count, id, token }) {
  console.log(token);
  if (!id) return true;
  let log = {
    PDT: "discount1",
    MDT: "discount2",
    CDT: "discount3",
  };
  let tank = store.unitsFromKeys[id];
  let currency = "MWM";
  if (tank.unit.type === "miner") currency = "MECH";
  let account = await store.user.getAccountName();
  let actions = [
    {
      user: store.user,
      name: "transfer",
      account: "metalwarmint",
      data: {
        from: account,
        to: "metalwargame",
        memo: `repair:${id}`,
        quantity: `${count} ${currency}`,
      },
    },
  ];
  if (token)
    actions.unshift({
      user: store.user,
      name: "transfer",
      account: "metalwarmint",
      data: {
        from: account,
        to: "metalwargame",
        memo: `${log[token]}:${id}`,
        quantity: `1 ${token}`,
      },
    });
  let response = await transaction(actions);
  return errorHandler(response);
}
async function teleportTransaction({ count, memo }) {
  let account = await store.user.getAccountName();
  let response = await transaction({
    user: store.user,
    name: "transfer",
    account: "metalwarmint",
    data: {
      from: account,
      to: "metalwargame",
      memo,
      quantity: `${count} MWM`,
    },
  });
  return errorHandler(response);
}
async function rent({ amount, days, stake_amount }) {
  let account = await store.user.getAccountName();
  let response = await transaction({
    user: store.user,
    name: "transfer",
    account: "eosio.token",
    data: {
      from: account,
      to: "metalwarrent",
      memo: `${days} ${stake_amount}`,
      quantity: `${amount}.00000000 WAX`,
    },
  });
  return errorHandler(response);
}
async function unpack({ id }) {
  let account = await store.user.getAccountName();
  let response = await transaction({
    user: store.user,
    name: "transfer",
    account: "atomicassets",
    data: {
      from: account,
      to: "metalwargame",

      asset_ids: ["" + id],
      memo: `unbox`,
    },
  });
  return errorHandler(response);
}
async function stakeUnit({ id }) {
  let account = await store.user.getAccountName();
  let response = await transaction({
    user: store.user,
    name: "transfer",
    account: "atomicassets",
    data: {
      from: account,
      to: "metalwargame",
      asset_ids: ["" + id],
      memo: "stake",
    },
  });
  return errorHandler(response);
}
async function exchange({ pdt }) {
  let account = await store.user.getAccountName();
  let response = await transaction({
    user: store.user,
    name: "transfer",
    account: "metalwarmint",
    data: {
      from: account,
      to: "metalwargame",
      memo: `${12}pdt:${1}cdt`,
      quantity: `${pdt} PDT`,
    },
  });
  return errorHandler(response);
}
async function report({ order_id }) {
  let response = await transaction({
    user: store.user,
    name: "report",
    account: "metalwarrent",
    data: {
      order_id,
    },
  });
  return errorHandler(response);
}
async function shardsToNft({ shardCode }) {
  let account = await store.user.getAccountName();
  let response = await transaction({
    user: store.user,
    name: "transfer",
    account: "metalwarmint",
    data: {
      from: account,
      to: "metalwargame",
      memo: `craft:${shardCode}`,
      quantity: `500 ${shardCode}`,
    },
  });
  return errorHandler(response);
}
async function craftMech({ count, shardCode }) {
  let account = await store.user.getAccountName();
  let response = await transaction({
    user: store.user,
    name: "transfer",
    account: "metalwarmint",
    data: {
      from: account,
      to: "metalwargame",
      memo: `forge:MECH`,
      quantity: `${count} ${shardCode}`,
    },
  });
  return errorHandler(response);
}
async function unstakeUnit({ id }) {
  let account = await store.user.getAccountName();
  let response = await transaction({
    user: store.user,
    name: "unstake",
    account: "metalwargame",
    data: {
      to: account,
      asset_ids: [id],
    },
  });
  return errorHandler(response);
}
async function placegarage({ id }) {
  let account = await store.user.getAccountName();
  let response = await transaction({
    user: store.user,
    name: "placegarage",
    account: "metalwargame",
    data: {
      asset_id: id,
    },
  });
  return errorHandler(response);
}
async function pickgarage({ location }) {
  let account = await store.user.getAccountName();
  let response = await transaction({
    user: store.user,
    name: "pickgarage",
    account: "metalwargame",
    data: {
      location,
    },
  });
  return errorHandler(response);
}
async function claimTokens({ id }) {
  let response = await transaction({
    user: store.user,
    name: "claim",
    account: "metalwargame",
    data: {
      asset_id: id,
    },
  });
  return errorHandler(response);
}
async function claimRent({ order_id, amount, receiver }) {
  let account = await store.user.getAccountName();
  if (!amount.match("WAX")) amount = amount + ".00000000 WAX";
  let response = await transaction([
    {
      user: store.user,
      name: "claim",
      account: "metalwarrent",
      data: {
        order_id,
      },
    },
    {
      user: store.user,
      name: "undelegatebw",
      account: "eosio",
      data: {
        from: account,
        receiver,
        unstake_cpu_quantity: amount,
        unstake_net_quantity: "0.00000000 WAX",
      },
    },
  ]);
  return errorHandler(response);
}
async function stakeRent({ order_id, amount, receiver }) {
  let account = await store.user.getAccountName();
  if (!amount.match("WAX")) amount = amount + ".00000000 WAX";
  let response = await transaction([
    {
      user: store.user,
      name: "delegatebw",
      account: "eosio",
      data: {
        from: account,
        receiver,
        stake_cpu_quantity: amount,
        stake_net_quantity: "0.00000000 WAX",
        transfer: false,
      },
    },
    {
      user: store.user,
      name: "stake",
      account: "metalwarrent",
      data: {
        creditor: account,
        order_id: order_id,
      },
    },
  ]);
  return errorHandler(response);
}
async function closeOrder({ order_id }) {
  let account = await store.user.getAccountName();
  let response = await transaction([
    {
      user: store.user,
      name: "closeorder",
      account: "metalwarrent",
      data: {
        order_id,
      },
    },
  ]);
  return errorHandler(response);
}
function errorHandler(response) {
  if (response === true) return true;
  else {
    store.vue.errors.push({ text: response });
    return false;
  }
}
export {
  store,
  getIngameTanks,
  setExampleUnits,
  createObjectOnMap,
  createUnits,
  moveTransaction,
  fireTransaction,
  repair,
  mineTransaction,
  dropStuffTransaction,
  collectStuffTransaction,
  teleportTransaction,
  rent,
  report,
  claimRent,
  stakeRent,
  closeOrder,
  shardsToNft,
  craftMech,
  exchange,
  stakeUnit,
  unpack,
  claimTokens,
  unstakeUnit,
  placegarage,
  pickgarage,
};

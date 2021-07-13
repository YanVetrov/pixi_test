import { Sprite, Texture, Container, Text, AnimatedSprite } from "pixi.js";
import { gsap } from "gsap";
import base from "./units_templates.js";
const objectsOnMap = [
  { name: "garage mini", image: "garage1", posX: 5, posY: 5 },
  { name: "garage big", image: "garage2", posX: 6, posY: 6 },
  {
    name: "geyser1",
    image: "geyser1",
    posX: 15,
    posY: 2,
    scaled: 0.5,
    diffX: 25,
    diffY: -70,
    alpha: 0.6,
  },
  {
    name: "geyser2",
    image: "geyser2",
    posX: 18,
    posY: 3,
    scaled: 0.5,
    diffX: 1,
    diffY: -80,
    alpha: 0.6,
  },
  {
    name: "geyser3",
    image: "geyser3",
    posX: 16,
    posY: 4,
    scaled: 0.5,
    diffX: 1,
    diffY: -80,
    alpha: 0.6,
  },
  {
    name: "geyser4",
    image: "geyser4",
    posX: 1,
    posY: 15,
    scaled: 0.5,
    diffX: 1,
    diffY: -80,
    alpha: 0.6,
  },
  {
    name: "geyser5",
    image: "geyser5",
    posX: 8,
    posY: 12,
    scaled: 0.5,
    diffX: 1,
    diffY: -80,
    alpha: 0.6,
  },
  {
    name: "geyser6",
    image: "geyser6",
    posX: 4,
    posY: 11,
    scaled: 0.5,
    diffX: 1,
    diffY: -80,
    alpha: 0.6,
  },
  {
    name: "geyser7",
    image: "geyser7",
    posX: 10,
    posY: 15,
    scaled: 0.5,
    diffX: 1,
    diffY: -80,
    alpha: 0.6,
  },
].map(el => {
  let sprite = Sprite.from(`./assets/${el.image}.png`);
  sprite.width = 120;
  sprite.height = 120;
  sprite.zIndex = 1;
  Object.keys(el).forEach(key => (sprite[key] = el[key]));
  sprite.interactive = true;
  sprite.buttonMode = true;

  return sprite;
});
function createUnits(arr) {
  return arr.map((el, i) => {
    let sprite = Sprite.from(`./assets/cards/${el.image}/ul.png`);
    ["u", "d", "r", "l", "ur", "ul", "dl", "dr"].forEach(key => {
      sprite[key] = Texture.from(`./assets/cards/${el.image}/${key}.png`);
      if (!sprite.broken) sprite.broken = {};
      sprite.broken[key] = Texture.from(
        `./assets/cards/${el.image}/broken/${key}.png`
      );
      if (el.type === "validator") {
        sprite["stake_" + key] = Texture.from(
          `./assets/cards/${el.image}/stake_${key}.png`
        );
      }
    });
    let container = new Container();
    container.zIndex = 6;
    sprite.width = 120;
    sprite.height = 120;
    sprite.dir = "ul";
    container.posX = el.x;
    container.posY = el.y;
    container.diffX = el.diffX;
    container.diffY = el.diffY;
    Object.keys(el).forEach(key => (sprite[key] = el[key]));
    Object.defineProperty(sprite, "direction", {
      get() {
        return this.dir;
      },
      set(val) {
        console.log(val, this[val]);
        if (!val) return "invalid";
        this.dir = val;
        this.texture = this[val];
      },
    });
    container.name = el.name;
    container.locked = false;
    container.lt = 0;
    container.timerText = new Text("", {
      fill: 0xefefef,
      fontFamily: "metalwar",
      fontSize: 15,
    });
    container.timerText.x = 50;
    container.timerText.y = -20;
    container.hpText = new Text(`${el.hp}/${el.strength}`, {
      fill: 0x00ffaa,
      fontFamily: "metalwar",
      fontSize: 15,
    });
    container.hpText.x = 50;
    container.unit = sprite;
    container.addChild(container.timerText);
    container.addChild(container.hpText);
    container.addChild(sprite);
    Object.defineProperty(container, "timer", {
      get() {
        return this.timerText.text;
      },
      set(val) {
        if (!val) val = "";
        this.timerText.text = val;
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
          this.timer = 0;
        }
        this.locked = !!val;
      },
    });
    Object.defineProperty(container, "health", {
      get() {
        return this.unit.hp;
      },
      set(val) {
        let color = 0x00ffaa;
        if (val < 10) color = 0xff9999;
        this.unit.hp = val;
        this.hpText.style.fill = color;
        this.hpText.text = `${val}/${this.unit.strength}`;
      },
    });
    container.stakeValidator = function () {
      if (this.locked) return 0;
      if (!this.unit.type === "validator")
        return console.log("not validator =" + this.unit.type);
      this.unit.direction = "stake_" + this.unit.direction;
      window.sound("teleport");
      this.locked = true;
    };
    if (el.type === "validator") {
      container.buttonMode = true;
      container.interactive = true;
      container.scale.x = 1.7;
      container.scale.y = 1.7;
      container.on("pointerup", e => {
        if (!container.active) return true;
        container.stakeValidator();
      });
    }

    return container;
  });
}
const units = createUnits(base);

let store = {
  state: null,
  id: null,
  mountains: null,
  bg: null,
  gameScene: null,
  target: null,
  clicked: true,
  blockedUI: false,
  cellsInLine: 20,
  countLines: 20,
  map: [],
  allMapCount: 40000,
  miniMap: null,
  u: {},
  cash: [],
  text: {},
  visibleZone: [],
  defaultPosX: 1200,
  defaultPosY: -400,
  x: 0,
  y: 0,
  user: null,
  units: [],
  objectsOnMap,
};
Object.defineProperty(store, "unit", {
  get() {
    return this.u;
  },
  set(unit) {
    this.u.active = false;
    unit.active = true;
    this.u = unit;
  },
});
const setExampleUnits = () => (store.units = createUnits(base));
async function getIngameTanks() {
  let account = await store.user.getAccountName();
  let started = Date.now();
  let response = await store.user.rpc.get_table_rows({
    json: true,
    code: "metalwargame",
    scope: "metalwargame",
    table: "units",
    limit: 10000,
    key_type: "i64",
    lower_bound: account,
    upper_bound: account,
    index_position: 2,
    reverse: true,
  });
  let end = Date.now();
  let ping = end - started;
  store.ping = ping;
  let arr = [];
  if (!response) {
    console.log();
  } else {
    let selfTanks = response.rows.filter(
      el => el.owner === store.user.accountName
    );
    console.log(selfTanks);
    selfTanks.forEach(el => {
      let tank = base.find(key => el.template_id === key.id);
      if (!tank) {
      } else {
        let locked = el.next_availability * 1000 > Date.now();
        let unlockedTime = el.next_availability * 1000;

        tank = {
          ...el,
          ...tank,
          inGame: true,
          id: el.asset_id,
          repair: Math.ceil((el.strength - el.hp) / 2),
          locked,
          unlockedTime,
        };
        arr.push(tank);
      }
    });
  }
  let validator = base.find(el => el.type === "validator");
  let wolf2 = base.find(el => el.name === "wolf2");
  store.units = createUnits([...arr, validator, wolf2]);
  store.unit = store.units[0];
}

async function moveTransaction({ id, x, y }) {
  if (!id) return true;
  let account = await store.user.getAccountName();
  let options = {
    actions: [
      {
        account: "metalwargame",
        name: "unitmove",
        authorization: [
          {
            actor: account,
            permission: store.user.requestPermission,
          },
        ],
        data: {
          asset_owner: account,
          asset_id: id,
          x,
          y,
        },
      },
    ],
  };
  console.log(options);
  let response = {};
  if (localStorage.getItem("ual-session-authenticator") === "Anchor") {
    try {
      response = await store.user.signTransaction(options, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      return true;
    } catch (e) {
      console.log({ ...e });
      return false;
    }
  }
  if (localStorage.getItem("ual-session-authenticator") === "Wax") {
    options.actions[0].authorization[0].permission = "active";
    try {
      response = await store.user.wax.api.transact(options, {
        blocksBehind: 3,
        expireSeconds: 30,
        broadcast: true,
        sign: true,
      });
      return true;
    } catch (e) {
      console.log("WCW Error: ");
      console.log({ ...e }, e);
      let errorText = "";
      if (
        e &&
        e.json &&
        e.json.error &&
        e.json.error.details &&
        e.json.error.details[0]
      )
        errorText = e.json.error.details[0].message;
      else
        errorText =
          "Something wrong. Сheck your browser for pop-up pages permission.(Required for work WAX cloud)";
      return false;
    }
  }
}
export { store, getIngameTanks, setExampleUnits, moveTransaction };

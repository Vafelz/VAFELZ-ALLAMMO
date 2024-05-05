"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const Traders_1 = require("C:/snapshot/project/obj/models/enums/Traders");
// Trader Settings
const baseJson = __importStar(require("../db/base.json"));
const assortJson = __importStar(require("../db/assort.json"));
class VafelzTrader {
    mod;
    logger;
    constructor() {
        this.mod = "VAFELZ-ALLAMMO-1.1.2";
    }
    /*
     * Some work needs to be done prior to SPT code being loaded, registering the profile image + setting trader update time inside the trader config json
     * @param container dependency container
     */
    preAkiLoad(container) {
        this.logger = container.resolve("WinstonLogger");
        this.logger.debug(`[${this.mod}] preAki loading...`);
        const preAkiModLoader = container.resolve("PreAkiModLoader");
        const imageRouter = container.resolve("ImageRouter");
        const hashUtil = container.resolve("HashUtil");
        const configServer = container.resolve("ConfigServer");
        const traderConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        const ragfairConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.RAGFAIR);
        this.registerProfileImage(preAkiModLoader, imageRouter);
        this.setTraderUpdateTime(traderConfig);
        Traders_1.Traders[baseJson._id] = baseJson._id;
        ragfairConfig.traders[baseJson._id] = true;
        this.logger.debug(`[${this.mod}] preAki loaded`);
    }
    /*
     * Majority of trader-related work occurs after the aki database has been loaded but prior to SPT code being run
     * @param container dependency container
     */
    postDBLoad(container) {
        this.logger.debug(`[${this.mod}] postDB loading...`);
        const db = container.resolve("DatabaseServer");
        const configServer = container.resolve("ConfigServer");
        const tables = db.getTables();
        const jsonUtil = container.resolve("JsonUtil");
        this.addTraderToDB(baseJson, tables, jsonUtil);
        this.addTraderToLocales(tables, baseJson.name, "VAFELZ", baseJson.nickname, baseJson.location, "OwO");
        this.logger.debug(`[${this.mod}] postDB loaded`);
    }
    registerProfileImage(preAkiModLoader, imageRouter) {
        const imageFilePath = `./${preAkiModLoader.getModPath(this.mod)}res`;
        imageRouter.addRoute(baseJson.avatar.replace(".jpg", ""), `${imageFilePath}/vafelz.jpg`);
    }
    setTraderUpdateTime(traderConfig) {
        const traderRefreshRecord = {
            traderId: baseJson._id,
            seconds: {
                min: 3600,
                max: 4000
            }
        };
        traderConfig.updateTime.push(traderRefreshRecord);
    }
    addTraderToDB(VAFELZ, tables, jsonUtil) {
        tables.traders[VAFELZ._id] = {
            assort: jsonUtil.deserialize(jsonUtil.serialize(assortJson)),
            base: jsonUtil.deserialize(jsonUtil.serialize(VAFELZ)),
            questassort: {
                started: {},
                success: {},
                fail: {}
            }
        };
    }
    addTraderToLocales(tables, fullName, firstName, nickName, location, description) {
        const locales = Object.values(tables.locales.global);
        for (const locale of locales) {
            locale[`${baseJson._id} Fullname`] = fullName;
            locale[`${baseJson._id} FirstName`] = firstName;
            locale[`${baseJson._id} Nickname`] = nickName;
            locale[`${baseJson._id} Location`] = location;
            locale[`${baseJson._id} Description`] = description;
        }
    }
}
module.exports = { mod: new VafelzTrader() };
//# sourceMappingURL=mod.js.map
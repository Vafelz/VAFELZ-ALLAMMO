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
const baseJson = __importStar(require("../db/base.json"));
const assortJson = __importStar(require("../db/assort.json"));
const Traders_1 = require("C:/snapshot/project/obj/models/enums/Traders");
class VafelsTrader {
    mod;
    ;
    logger;
    configServer;
    constructor() {
        this.mod = "VAFELZ-ALLAMMO";
    }
    preAkiLoad(container) {
        const logger = container.resolve("WinstonLogger");
        const preAkiModLoader = container.resolve("PreAkiModLoader");
        const imageRouter = container.resolve("ImageRouter");
        const configServer = container.resolve("ConfigServer");
        const traderConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        this.registerProfileImage(preAkiModLoader, imageRouter);
        this.setupTraderUpdateTime(traderConfig);
        Traders_1.Traders[baseJson._id] = baseJson._id;
    }
    postDBLoad(container) {
        this.configServer = container.resolve("ConfigServer");
        this.ragfairConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.RAGFAIR);
        const logger = container.resolve("WinstonLogger");
        const db = container.resolve("DatabaseServer");
        const configServer = container.resolve("ConfigServer");
        const traderConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        const jsonUtil = container.resolve("JsonUtil");
        const tables = db.getTables();
        this.addTraderToDb(baseJson, tables, jsonUtil);
        this.addTraderToLocales(tables, baseJson.name, "", baseJson.nickname, baseJson.location, "UwU");
    }
    registerProfileImage(preAkiModLoader, imageRouter) {
        const imageFilePath = `./${preAkiModLoader.getModPath(this.mod)}res`;
        imageRouter.addRoute(baseJson.avatar.replace(".jpg", ""), `${imageFilePath}/vafelz.jpg`);
    }
    setupTraderUpdateTime(traderConfig) {
        const traderRefreshRecord = { traderId: baseJson._id, seconds: 3600 };
        traderConfig.updateTime.push(traderRefreshRecord);
    }
    addTraderToDb(traderDetailsToAdd, tables, jsonUtil) {
        tables.traders[traderDetailsToAdd._id] = {
            assort: jsonUtil.deserialize(jsonUtil.serialize(assortJson)),
            base: jsonUtil.deserialize(jsonUtil.serialize(traderDetailsToAdd))
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
module.exports = { mod: new VafelsTrader() };
//# sourceMappingURL=mod.js.map
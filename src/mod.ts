import { DependencyContainer } from "tsyringe";

// SPT Types
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { Traders } from "@spt-aki/models/enums/Traders";
import { ITraderConfig, UpdateTime } from "@spt-aki/models/spt/config/ITraderConfig";
import { ITraderBase, ITraderAssort } from "@spt-aki/models/eft/common/tables/ITrader";
import { IRagfairConfig } from "@spt-aki/models/spt/config/IRagfairConfig";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";

// Trader Settings
import * as baseJson from "../db/base.json";
import * as assortJson from "../db/assort.json";

class VafelzTrader implements IPreAkiLoadMod, IPostDBLoadMod {
    private mod: string;
    private logger: ILogger;

    constructor() {
        this.mod = "VAFELZ-ALLAMMO-1.1.2"
    }

    /*
     * Some work needs to be done prior to SPT code being loaded, registering the profile image + setting trader update time inside the trader config json
     * @param container dependency container
     */
    public preAkiLoad(container: DependencyContainer): void {
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.logger.debug(`[${this.mod}] preAki loading...`);

        const preAkiModLoader: PreAkiModLoader = container.resolve<PreAkiModLoader>("PreAkiModLoader");
        const imageRouter: ImageRouter = container.resolve<ImageRouter>("ImageRouter");
        const hashUtil: HashUtil = container.resolve<HashUtil>("HashUtil");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const traderConfig: ITraderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
        const ragfairConfig = configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR);

        this.registerProfileImage(preAkiModLoader, imageRouter);
        this.setTraderUpdateTime(traderConfig);

        Traders[baseJson._id] = baseJson._id;
        ragfairConfig.traders[baseJson._id] = true;

        this.logger.debug(`[${this.mod}] preAki loaded`);
    }

    /*
     * Majority of trader-related work occurs after the aki database has been loaded but prior to SPT code being run
     * @param container dependency container
     */
    public postDBLoad(container: DependencyContainer): void {
        this.logger.debug(`[${this.mod}] postDB loading...`);

        const db: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const configServer: ConfigServer = container.resolve<ConfigServer>("ConfigServer");
        const tables = db.getTables();
        const jsonUtil: JsonUtil = container.resolve<JsonUtil>("JsonUtil");

        this.addTraderToDB(baseJson, tables, jsonUtil);
        this.addTraderToLocales(tables, baseJson.name, "VAFELZ", baseJson.nickname, baseJson.location, "OwO");

        this.logger.debug(`[${this.mod}] postDB loaded`);
    }

    private registerProfileImage(preAkiModLoader: PreAkiModLoader, imageRouter: ImageRouter): void {
        const imageFilePath = `./${preAkiModLoader.getModPath(this.mod)}res`;
        imageRouter.addRoute(baseJson.avatar.replace(".jpg", ""), `${imageFilePath}/vafelz.jpg`);
    }

    private setTraderUpdateTime(traderConfig: ITraderConfig): void {
        const traderRefreshRecord: UpdateTime = {
            traderId: baseJson._id,
            seconds: {
                min: 3600,
                max: 4000
            } };
        traderConfig.updateTime.push(traderRefreshRecord);
    }

    private addTraderToDB(VAFELZ: any, tables: IDatabaseTables, jsonUtil: jsonUtil): void {
        tables.traders[VAFELZ._id] = {
            assort: jsonUtil.deserialize(jsonUtil.serialize(assortJson)) as ITraderAssort,
            base: jsonUtil.deserialize(jsonUtil.serialize(VAFELZ)) as ITraderBase,
            questassort: {
                started: {},
                success: {},
                fail: {}
            }
        };
    }

    private addTraderToLocales(tables: IDatabaseTables, fullName: string, firstName: string, nickName: string, location: string, description: string) {
        const locales = Object.values(tables.locales.global) as RecordM<string, string>[];
        for (const locale of locales) {
            locale[`${baseJson._id} Fullname`] = fullName;
            locale[`${baseJson._id} FirstName`] = firstName;
            locale[`${baseJson._id} Nickname`] = nickName;
            locale[`${baseJson._id} Location`] = location;
            locale[`${baseJson._id} Description`] = description;
        }
    }
}
module.exports = { mod: new VafelzTrader() }

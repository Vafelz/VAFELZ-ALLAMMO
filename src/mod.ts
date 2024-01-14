/* eslint-disable @typescript-eslint/naming-convention */
import { DependencyContainer } from "tsyringe";
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { ITraderAssort, ITraderBase } from "@spt-aki/models/eft/common/tables/ITrader";
import { ITraderConfig, UpdateTime } from "@spt-aki/models/spt/config/ITraderConfig";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { Item } from "@spt-aki/models/eft/common/tables/IItem";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import * as baseJson from "../db/superammotrader.json";
import * as assortJson from "../db/assort.json";

class VafelsTrader implements IPreAkiLoadMod, IPostAkiLoadMod, IPostDBLoadMod {
    mod: string;
    logger: ILogger;
    private modConfig = require("../config/config.json");
    constructor() {
        this.mod = "VAFELZ-ALLAMMO";
    }
    public preAkiLoad(container: DependencyContainer): void {
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.registerProfileImage(container);
        this.setupTraderUpdateTime(container);
    }
    public postDBLoad(container: DependencyContainer): void {
        const db = container.resolve<DatabaseServer>("DatabaseServer").getTables();
        const JsonUtil = container.resolve<DatabaseServer>("JsonUtil");
        db.traders[baseJson._id] = {
            assort: this.createAssortTable(),
            base: JsonUtil.deserialize(JsonUtil.serialize(baseJson)) as ITraderBase,
            questassort: undefined
        };
        this.addTraderToLocales(db, baseJson.name, "", baseJson.nickname, baseJson.location, "UwU");
    }
    private registerProfileImage(container: DependencyContainer): void {
        const PreAkiModLoader = container.resolve<PreAkiModLoader>("PreAkiModLoader");
        const imageFilePath = `./${PreAkiModLoader.getModPath(this.mod)}res`;
        const ImageRouter = container.resolve<ImageRouter>("ImageRouter");
        imageRouter.addRoute(baseJson.avatar.replace(".jpg", ""), `${imageFilePath}/vafelz.jpg`);
    }
    private setupTraderUpdateTime(container: DependencyContainer): void {
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const traderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
        const traderRefreshConfig: UpdateTime = {traderId: baseJson._id, seconds: 3600};
        traderConfig.updateTime.push(traderRefreshConfig);
    }
    private addTraderToLocales(tables: IDatabaseTables, fullName: string, firstName: string, nickName: string, location: string, description: string) {
        const locales = Object.values(tables.locales.global) as Record<string,string>[];
        for (const local of locales) {
            locale[`${baseJson._id} Fullname`] = fullName;
            locale[`${baseJson._id} FirstName`] = firstName;
            locale[`${baseJson._id} Nickname`] = nickName;
            locale[`${baseJson._id} Location`] = location;
            locale[`${baseJson._id} Description`] = description;
        }
    }
    private createAssortTable(): ITraderAssort {
        const assortTable: ITraderAssort = {
            barter_scheme: {},
            items: [],
            loyal_level_items: {},
            nextResupply: 0
        };
        const ROUBLE_ID = "5449016a4bdc2d6f028b456f";

        // 12x70MM BUCKSHOT
        // 5.25 Buckshot
        this.pushTableItem("12x70525buckshot", "5d6e6772a4b936088465b17c", 20);
        // 8.5mm Magnum Buckshot
        this.pushTableItem("12x7085magnum", "5d6e6806a4b936088465b17e", 106);
        // 7mm Buckshot
        this.pushTableItem("12x707buckshot", "560d5e524bdc2d25448b4571", 17);
        // 6.5mm Express Buckshot
        this.pushTableItem("12x7065express", "5d6e67fba4b9361bc73bc779", 22);
        // Piranha
        this.pushTableItem("12x70piranha", "64b8ee384b75259c590fa89b", 123);
        // Flechette
        this.pushTableItem("12x70flechette", "5d6e6911a4b9361bd5780d52", 187);

        // 12x70MM SLUG
        // RIP
        this.pushTableItem("12x70ripslug", "5c0d591486f7744c505b416f", 392);
        // SuperFormance HP Slug
        this.pushTableItem("12x70superformanceslug", "5d6e68d1a4b93622fe60e845", 108);
        // Grizzly 40 Slug
        this.pushTableItem("12x70grizzly40", "5d6e6869a4b9361c140bcfde", 37);
        // Copper Sabot HP Slug
        this.pushTableItem("12x70coppersabot", "5d6e68b3a4b9361bca7e50b5", 46);
        // Lead Slug
        this.pushTableItem("12x70leadslug", "58820d1224597753c90aeb13", 31);
        // Dual Sabot Slug
        this.pushTableItem("12x70dualsabot", "5d6e68dea4b9361bcc29e659", 38);
        // "Poleva-3" Slug
        this.pushTableItem("12x70poleva3slug", "5d6e6891a4b9361bd473feea", 29);
        // FTX Custom Lite Slug
        this.pushTableItem("12x70ftxslug", "5d6e68e6a4b9361c140bcfe0", 40);
        // "Poleva-6U" Slug
        this.pushTableItem("12x70poleva6uslug", "5d6e689ca4b9361bc8618956", 38);
        // Makeshift .50 BMG Slug
        this.pushTableItem("12x7050bmgslug", "5d6e68c4a4b9361b93413f79", 224);
        // AP-20 Armor-Piercing Slug
        this.pushTableItem("12x70ap20slug", "5d6e68a8a4b9360b6c0d54e2", 498);

        // 20x70MM
        // 5.6mm Buckshot
        this.pushTableItem("20x7056buckshot", "5d6e695fa4b936359b35d852", 11);
        // 6.2mm Buckshot
        this.pushTableItem("20x7062buckshot", "5d6e69b9a4b9361bc8618958", 17);
        // 7.5mm Buckshot
        this.pushTableItem("20x7075buckshot", "5a38ebd9c4a282000d722a5b", 13);
        // 7.3mm Buckshot
        this.pushTableItem("20x7073buckshot", "5d6e69c7a4b9360b6c0d54e4", 21);
        // Devastator Slug
        this.pushTableItem("20x70devastatorslug", "5d6e6a5fa4b93614ec501745", 101);
        // "Poleva-3" Slug
        this.pushTableItem("20x70poleva3slug", "5d6e6a53a4b9361bd473feec", 27);
        // Star Slug
        this.pushTableItem("20x70starslug", "5d6e6a05a4b93618084f58d0", 45);
        // "Poleva-6U" Slug
        this.pushTableItem("20x70poleva6uslug", "5d6e6a42a4b9364f07165f52", 36);

        // 23x75MM
        // "Zveda" Flashbang Round
        this.pushTableItem("23x75zveda", "5e85a9f4add9fe03027d9bf1", 549);
        // "Shrapnel-25" Buckshot
        this.pushTableItem("23x75shrapnel25", "5f647f31b6238e5dd066e196", 54);
        // "Shrapnel-10" Buckshot
        this.pushTableItem("23x75shrapnel10", "5e85a9a6eacf8c039e4e2ac1", 44);
        // "Barrikda" Slug
        this.pushTableItem("23x75barrikda", "5e85aa1a988a8701445df1f5", 143);

        // 9x18MM MAKAROV
        // SP8 GZH
        this.pushTableItem("9x18sp8gzh", "5737218f245977612125ba51", 39);
        // SP7 GZH
        this.pushTableItem("9x18sp7gzh", "57372140245977611f70ee91", 94);
        // PSV
        this.pushTableItem("9x18psv", "5737207f24597760ff7b25f2", 41);
        // P GZH
        this.pushTableItem("9x18pgzh", "573719762459775a626ccbc1", 7);
        // PSO GZH
        this.pushTableItem("9x18psogzh", "57371f8d24597761006c6a81", 12);
        // PS GS PPO
        this.pushTableItem("9x18psgsppo", "57371f2b24597761224311f1", 16);
        // PRS GS
        this.pushTableItem("9x18prsgs", "57371eb62459776125652ac1", 22);
        // PPE GZH
        this.pushTableItem("9x18ppegzh", "57371b192459775a9f58a5e0", 29);
        // PPT GZH
        this.pushTableItem("9x18pptgzh", "57371e4124597760ff7b25f1", 24);
        // PST GZH
        this.pushTableItem("9x18pstgzh", "5737201124597760fc4431f1", 25);
        // RG028 GZH
        this.pushTableItem("9x18rg028gzh", "573720e02459776143012541", 48);
        // BZHT GZH
        this.pushTableItem("9x18bzhtgzh", "573718ba2459775a75491131", 36);
        // PSTM GZH
        this.pushTableItem("9x18pstmgzh", "57371aab2459775a77142f22", 64);
        // PBM GZH
        this.pushTableItem("9x18pbmgzh", "573719df2459775a626ccbc2", 68);

        // 7.62x25MM TOKAREV
        // LRNPC
        this.pushTableItem("762x25lrnpc", "573602322459776445391df1", 38);
        // LRN
        this.pushTableItem("762x25lrn", "573601b42459776410737435", 27);
        // FMJ43
        this.pushTableItem("762x25fmj43", "5735ff5c245977640e39ba7e", 28);
        // AKBS
        this.pushTableItem("762x25akbs", "5735fdcd2459776445391d61", 27);
        // P GL
        this.pushTableItem("762x25pgl", "5736026a245977644601dc61", 29);
        // PT GZH
        this.pushTableItem("762x25ptgzh", "573603c924597764442bd9cb", 35);
        // PST GZH
        this.pushTableItem("762x25pstgzh", "573603562459776430731618", 39);

        // 9x19MM PARABELLUM
        // RIP
        this.pushTableItem("9x19rip", "5c0d56a986f774449d5de529", 236);
        // Quakemaker
        this.pushTableItem("9x19quakemaker", "5efb0e16aeb21837e749c7ff", 168);
        // PSO GZH
        this.pushTableItem("9x19psogzh", "58864a4f2459770fcc257101", 27);
        // Luger CCI
        this.pushTableItem("9x19lugercci", "5a3c16fe86f77452b62de32a", 95);
        // GT GZH
        this.pushTableItem("9x19gtgzh", "5c3df7d588a4501f290594e5", 40);
        // M882
        this.pushTableItem("9x19m882", "64b7bbb74b75259c590fa897", 67);
        // PST GZH
        this.pushTableItem("9x19pstgzh", "56d59d3ad2720bdb418b4577", 35);
        // AP 6.3
        this.pushTableItem("9x19ap63", "5c925fa22e221601da359b7b", 118);
        // PBP GZH
        this.pushTableItem("9x19pbpgzh", "5efb0da7a29a85116f6ea05f", 336);

        // .45 ACP
        // RIP
        this.pushTableItem("45rip", "5ea2a8e200685063ec28c05a", 235);
        // Hydra-Shok
        this.pushTableItem("45hydrashok", "5efb0fc6aeb21837e749c801", 84);
        // Lasermatch FMJ
        this.pushTableItem("45lasermatchfmj", "5efb0d4f4bc50b58e81710f3", 43);
        // Match FMJ
        this.pushTableItem("45matchfmj", "5e81f423763d9f754677bf2e", 53);
        // AP
        this.pushTableItem("45ap", "5efb0cabfb3e451d70735af5", 375);

        // 9x21MM
        // PE GZH
        this.pushTableItem("9x21pegzh", "5a26ac06c4a282000c5a90a8", 39);
        // P GZH
        this.pushTableItem("9x21pgzh", "5a26abfac4a28232980eabff", 78);
        // PS GZH
        this.pushTableItem("9x21psgzh", "5a269f97c4a282000b151807", 136);
        // BT GZH
        this.pushTableItem("9x21btgzh", "5a26ac0ec4a28200741e1e18", 312);

        // .357 MAGNUM
        // SP
        this.pushTableItem("357sp", "62330c40bdd19b369e1e53d1", 56);
        // HP
        this.pushTableItem("35hp7", "62330bfadc5883093563729b", 68);
        // JHP
        this.pushTableItem("357jhp", "62330c18744e5e31df12f516", 104);
        // FMJ
        this.pushTableItem("357fmj", "62330b3ed4dc74626d570b95", 80);

        // 5.7x28MM
        // R37.F
        this.pushTableItem("57x28r37f", "5cc86832d7f00c000d3a6e6c", 188);
        // F37.X
        this.pushTableItem("57x28f37x", "5cc86840d7f00c002412c56c", 123);
        // SS198LF
        this.pushTableItem("57x28ss198lf", "5cc80f79e4a949033c7343b2", 45);
        // SS197SR
        this.pushTableItem("57x28ss197sr", "5cc80f8fe4a949033b0224a2", 84);
        // SB193
        this.pushTableItem("57x28sb193", "5cc80f67e4a949035e43bbba", 151);
        // L191
        this.pushTableItem("57x28l191", "5cc80f53e4a949000e1ea4f8", 174);
        // SS190
        this.pushTableItem("57x28ss190", "5cc80f38e4a949001152b560", 258);

        // 4.6x30MM
        // Action SX
        this.pushTableItem("46x30actionsx", "5ba26812d4351e003201fef1", 39);
        // Subsonic SX
        this.pushTableItem("46x30subsonicsx", "5ba26844d4351e00334c9475", 56);
        // JSP SX
        this.pushTableItem("46x30jspsx", "64b6979341772715af0f9c39", 157);
        // FMJ SX
        this.pushTableItem("46x30fmjsx", "5ba2678ad4351e44f824b344", 238);
        // AP SX
        this.pushTableItem("46x30apsx", "5ba26835d4351e0035628ff5", 417);

        // 9x39MM
        // SP-5 GS
        this.pushTableItem("9x39sp5gs", "57a0dfb82459774d3078b56c", 123);
        // SPP GS
        this.pushTableItem("9x39sppgs", "5c0d668f86f7747ccb7f13b2", 246);
        // PAB-9 GS
        this.pushTableItem("9x39pab9gs", "61962d879bb3d20b0946d385", 375);
        // SP-6 GS
        this.pushTableItem("9x39sp6gs", "57a0e5022459774d1673f889", 515);
        // BP GS
        this.pushTableItem("9x39bpgs", "5c0d688c86f77413ae3407b2", 728);

        // .366 TKM
        // Geska
        this.pushTableItem("366geska", "59e6658b86f77411d949b250", 42);
        // FMJ
        this.pushTableItem("366fmj", "59e6542b86f77411dc52a77a", 45);
        // EKO
        this.pushTableItem("366eko", "59e655cb86f77411dc52a77b", 62);
        // AP-M
        this.pushTableItem("366apm", "5f0596629e22f464da6bbdd9", 403);

        // 5.45x39MM
        // HP
        this.pushTableItem("545x39hp", "56dff216d2720bbd668b4568", 28);
        // PRS GS
        this.pushTableItem("545x39prsgs", "56dff338d2720bbd668b4569", 33);
        // SP
        this.pushTableItem("545x39sp", "56dff421d2720b5f5a8b4567", 39);
        // US GS
        this.pushTableItem("545x39usgs", "56dff4ecd2720b5f5a8b4568", 49);
        // T GS
        this.pushTableItem("545x39tgs", "56dff4a2d2720bbd668b456a", 50);
        // FMJ
        this.pushTableItem("545x39fmj", "56dff0bed2720bb0668b4567", 55);
        // PS GS
        this.pushTableItem("545x39psgs", "56dff3afd2720bba668b4567", 78);
        // PP GS
        this.pushTableItem("545x39ppgs", "56dff2ced2720bb4668b4567", 123);
        // BT GS
        this.pushTableItem("545x39btgs", "56dff061d2720bb5668b4567", 302);
        // 7N40
        this.pushTableItem("545x397n40", "61962b617c6c7b169525f168", 504);
        // BP GS
        this.pushTableItem("545x39bpgs", "56dfef82d2720bbd668b4567", 353);
        // BS GS
        this.pushTableItem("545x39bsgs", "56dff026d2720bb8668b4567", 437);
        // PPBS GS "Igolnik"
        this.pushTableItem("545x39ppbs", "5c0d5e4486f77478390952fe", 694);

        // 5.56x45MM
        // Warmageddon
        this.pushTableItem("556x45warmageddon", "5c0d5ae286f7741e46554302", 73);
        // HP
        this.pushTableItem("556x45hp", "59e6927d86f77411da468256", 28);
        // MK.255 MOD.0 (RRLP)
        this.pushTableItem("556x45mk255", "59e6918f86f7746c9f75e849", 50);
        // M856
        this.pushTableItem("556x45m856", "59e68f6f86f7746c9f75e846", 56);
        // FMJ
        this.pushTableItem("556x45fmj", "59e6920f86f77411d82aa167", 73);
        // M855
        this.pushTableItem("556x45m855", "54527a984bdc2d4e668b4567", 101);
        // MK.318 MOD.0 (SOST)
        this.pushTableItem("556x45mk318", "60194943740c5d77f6705eea", 166);
        // M856A1
        this.pushTableItem("556x45m856a1", "59e6906286f7746c9f75e847", 239);
        // M855A1
        this.pushTableItem("556x45m855a1", "54527ac44bdc2d36668b4567", 398);
        // M995
        this.pushTableItem("556x45m995", "59e690b686f7746c9f75e848", 689);
        // SSA AP
        this.pushTableItem("556x45ssaap", "601949593ae8f707c4608daa", 854);

        // 7.62x39MM
        // HP
        this.pushTableItem("762x39hp", "59e4d3d286f774176a36250a", 39);
        // SP
        this.pushTableItem("762x39sp", "64b7af734b75259c590fa895", 57);
        // FMJ
        this.pushTableItem("762x39fmj", "64b7af5a8532cf95ee0a0dbd", 78);
        // US GZH
        this.pushTableItem("762x39usgzh", "59e4d24686f7741776641ac7", 90);
        // T-45M1 GZH
        this.pushTableItem("762x39t45m1gzh", "59e4cf5286f7741778269d8a", 112);
        // PS GZH
        this.pushTableItem("762x39psgzh", "5656d7c34bdc2d9d198b4587", 134);
        // PP
        this.pushTableItem("762x39pp", "64b7af434b75259c590fa893", 398);
        // BP GZH
        this.pushTableItem("762x39bpgzh", "59e0d99486f7744a32234762", 622);
        // MAI AP
        this.pushTableItem("762x39maiap", "601aa3d2b2bcb34913271e6d", 784);

        // .300 BLACKOUT
        // Whisper
        this.pushTableItem("300whisper", "6196365d58ef8c428c287da1", 68);
        // V-Max
        this.pushTableItem("300vmax", "6196364158ef8c428c287d9f", 90);
        // BCP FMJ
        this.pushTableItem("300bcpfmj", "5fbe3ffdf8b6a877a729ea82", 161);
        // M62 Tracer
        this.pushTableItem("300m62", "619636be6db0f2477964e710", 231);
        // CBJ
        this.pushTableItem("300cbj", "64b8725c4b75259c590fa899", 308);
        // AP
        this.pushTableItem("300ap", "5fd20ff893a8961fc660a954", 487);

        // 7.62x51MM
        // Ultra Nosler
        this.pushTableItem("762x51ultranosler", "5e023e88277cce2b522ff2b1", 59);
        // TCW SP
        this.pushTableItem("762x51tcwsp", "5e023e6e34d52a55c3304f71", 95);
        // BCP FMJ
        this.pushTableItem("762x51bcpfmj", "5e023e53d4353e3302577c4c", 134);
        // M80
        this.pushTableItem("762x51m80", "58dd3ad986f77403051cba8f", 235);
        // M62 TRACER
        this.pushTableItem("762x51m62", "5a608bf24f39f98ffc77720e", 336);
        // M61
        this.pushTableItem("762x51m61", "5a6086ea4f39f99cd479502f", 694);
        // M993
        this.pushTableItem("762x51m993", "5efb0c1bd79ff02a1f5e68d9", 965);

        // 7.62x54R
        // HP BT
        this.pushTableItem("762x54hpbt", "64b8f7c241772715af0f9c3d", 106);
        // SP BT
        this.pushTableItem("762x54spbt", "64b8f7b5389d7ffd620ccba2", 136);
        // FMJ
        this.pushTableItem("762x54fmj", "64b8f7968532cf95ee0a0dbf", 151);
        // T-46M GZH
        this.pushTableItem("762x54t46mgzh", "5e023cf8186a883be655e54f", 199);
        // LPS GZH
        this.pushTableItem("762x54lpsgzh", "5887431f2459777e1612938f", 274);
        // PS GZH
        this.pushTableItem("762x54psgzh", "59e77a2386f7742ee578960a", 515);
        // BT GZH
        this.pushTableItem("762x54btgzh", "5e023d34e8a400319a28ed44", 661);
        // SNB GZH
        this.pushTableItem("762x54snbgzh", "560d61e84bdc2da74d8b4571", 764);
        // BS GS
        this.pushTableItem("762x54bsgs", "5e023d48186a883be655e551", 1109);

        // 12.7x55MM
        // PS12A
        this.pushTableItem("127x55ps12a", "5cadf6e5ae921500113bb973", 123);
        // PS12
        this.pushTableItem("127x55ps12", "5cadf6ddae9215051e1c23b2", 202);
        // PS12B
        this.pushTableItem("127x55ps12b", "5cadf6eeae921500134b2799", 504);

        // .338 LAPUA MAGNUM
        // TAC-X
        this.pushTableItem("338tacx", "5fc382b6d6fa9c00c571bbc3", 381);
        // UCW
        this.pushTableItem("338ucw", "5fc382c1016cce60e8341b20", 465);
        // FMJ
        this.pushTableItem("338fmj", "5fc275cf85fd526b824a571a", 1008);
        // AP
        this.pushTableItem("338ap", "5fc382a9d724d907e2077dab", 2565);
    }
    private pushTableItem(tableID: string, itemID: string, price: int) {
        const tableID: Item = {
            _id: itemID,
            _tpl: itemID,
            parentId: "hideout",
            slotId: "hideout",
            upd: {
                UnlimitedCount: true,
                StackObjectsCount: 999999999
            }
        };
        assortTable.items.push(tableID);
        assortTable.barter_scheme[itemID] = [
            [
                {
                    count: price
                    _tpl: ROUBLE_ID
                }
            ]
        ]
    }
}
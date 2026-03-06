import type { Sequelize } from "sequelize";
import { Account as _Account } from "./Account";
import type { AccountAttributes, AccountCreationAttributes } from "./Account";
import { Feature as _Feature } from "./Feature";
import type { FeatureAttributes, FeatureCreationAttributes } from "./Feature";
import { File as _File } from "./File";
import type { FileAttributes, FileCreationAttributes } from "./File";
import { Flag as _Flag } from "./Flag";
import type { FlagAttributes, FlagCreationAttributes } from "./Flag";

export {
  _Account as Account,
  _Feature as Feature,
  _File as File,
  _Flag as Flag,
};

export type {
  AccountAttributes,
  AccountCreationAttributes,
  FeatureAttributes,
  FeatureCreationAttributes,
  FileAttributes,
  FileCreationAttributes,
  FlagAttributes,
  FlagCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const Account = _Account.initModel(sequelize);
  const Feature = _Feature.initModel(sequelize);
  const File = _File.initModel(sequelize);
  const Flag = _Flag.initModel(sequelize);

  File.belongsTo(Account, { as: "UploadedBy", foreignKey: "UploadedById"});
  Account.hasMany(File, { as: "Files", foreignKey: "UploadedById"});
  Flag.belongsTo(Account, { as: "Account", foreignKey: "AccountId"});
  Account.hasMany(Flag, { as: "Flags", foreignKey: "AccountId"});
  Flag.belongsTo(Feature, { as: "Feature", foreignKey: "FeatureId"});
  Feature.hasMany(Flag, { as: "Flags", foreignKey: "FeatureId"});
  Account.belongsTo(File, { as: "ProfileFile", foreignKey: "ProfileFileId"});
  File.hasMany(Account, { as: "Accounts", foreignKey: "ProfileFileId"});

  return {
    Account: Account,
    Feature: Feature,
    File: File,
    Flag: Flag,
  };
}

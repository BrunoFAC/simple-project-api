import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Account, AccountId } from './Account';
import type { Feature, FeatureId } from './Feature';

export interface FlagAttributes {
  Id: number;
  AccountId: number;
  FeatureId: number;
  Access: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  IsDeleted: number;
}

export type FlagPk = "Id";
export type FlagId = Flag[FlagPk];
export type FlagOptionalAttributes = "Id" | "Access" | "CreatedAt" | "UpdatedAt" | "IsDeleted";
export type FlagCreationAttributes = Optional<FlagAttributes, FlagOptionalAttributes>;

export class Flag extends Model<FlagAttributes, FlagCreationAttributes> implements FlagAttributes {
  Id!: number;
  AccountId!: number;
  FeatureId!: number;
  Access!: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  IsDeleted!: number;

  // Flag belongsTo Account via AccountId
  Account!: Account;
  getAccount!: Sequelize.BelongsToGetAssociationMixin<Account>;
  setAccount!: Sequelize.BelongsToSetAssociationMixin<Account, AccountId>;
  createAccount!: Sequelize.BelongsToCreateAssociationMixin<Account>;
  // Flag belongsTo Feature via FeatureId
  Feature!: Feature;
  getFeature!: Sequelize.BelongsToGetAssociationMixin<Feature>;
  setFeature!: Sequelize.BelongsToSetAssociationMixin<Feature, FeatureId>;
  createFeature!: Sequelize.BelongsToCreateAssociationMixin<Feature>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Flag {
    return Flag.init({
    Id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    AccountId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'account',
        key: 'Id'
      }
    },
    FeatureId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'feature',
        key: 'Id'
      }
    },
    Access: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    CreatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    UpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    IsDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'flag',
    timestamps: false,
    freezeTableName: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id" },
        ]
      },
      {
        name: "FK_Account_AccountId",
        using: "BTREE",
        fields: [
          { name: "AccountId" },
        ]
      },
      {
        name: "FK_Feature_FeatureId",
        using: "BTREE",
        fields: [
          { name: "FeatureId" },
        ]
      },
      {
        name: "IDX_Access",
        using: "BTREE",
        fields: [
          { name: "Access" },
        ]
      },
    ]
  });
  }
}

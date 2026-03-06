import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Flag, FlagId } from './Flag';

export interface FeatureAttributes {
  Id: number;
  Title: string;
  Description: string;
  Visibility: number;
  IsDeleted: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export type FeaturePk = "Id";
export type FeatureId = Feature[FeaturePk];
export type FeatureOptionalAttributes = "Id" | "Visibility" | "IsDeleted" | "CreatedAt" | "UpdatedAt";
export type FeatureCreationAttributes = Optional<FeatureAttributes, FeatureOptionalAttributes>;

export class Feature extends Model<FeatureAttributes, FeatureCreationAttributes> implements FeatureAttributes {
  Id!: number;
  Title!: string;
  Description!: string;
  Visibility!: number;
  IsDeleted!: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;

  // Feature hasMany Flag via FeatureId
  Flags!: Flag[];
  getFlags!: Sequelize.HasManyGetAssociationsMixin<Flag>;
  setFlags!: Sequelize.HasManySetAssociationsMixin<Flag, FlagId>;
  addFlag!: Sequelize.HasManyAddAssociationMixin<Flag, FlagId>;
  addFlags!: Sequelize.HasManyAddAssociationsMixin<Flag, FlagId>;
  createFlag!: Sequelize.HasManyCreateAssociationMixin<Flag>;
  removeFlag!: Sequelize.HasManyRemoveAssociationMixin<Flag, FlagId>;
  removeFlags!: Sequelize.HasManyRemoveAssociationsMixin<Flag, FlagId>;
  hasFlag!: Sequelize.HasManyHasAssociationMixin<Flag, FlagId>;
  hasFlags!: Sequelize.HasManyHasAssociationsMixin<Flag, FlagId>;
  countFlags!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof Feature {
    return Feature.init({
    Id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    Title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Visibility: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    IsDeleted: {
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
    }
  }, {
    sequelize,
    tableName: 'feature',
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
        name: "IDX_Visibility",
        using: "BTREE",
        fields: [
          { name: "Visibility" },
        ]
      },
    ]
  });
  }
}

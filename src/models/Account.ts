import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { File, FileId } from './File';
import type { Flag, FlagId } from './Flag';

export interface AccountAttributes {
  Id: number;
  Username: string;
  Email: string;
  Password: string;
  Role: number;
  IsDeleted: number;
  ProfileFileId?: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  FailedPasswordAttempts: number;
}

export type AccountPk = "Id";
export type AccountId = Account[AccountPk];
export type AccountOptionalAttributes = "Id" | "Role" | "IsDeleted" | "ProfileFileId" | "CreatedAt" | "UpdatedAt" | "FailedPasswordAttempts";
export type AccountCreationAttributes = Optional<AccountAttributes, AccountOptionalAttributes>;

export class Account extends Model<AccountAttributes, AccountCreationAttributes> implements AccountAttributes {
  Id!: number;
  Username!: string;
  Email!: string;
  Password!: string;
  Role!: number;
  IsDeleted!: number;
  ProfileFileId?: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  FailedPasswordAttempts!: number;

  // Account hasMany File via UploadedById
  Files!: File[];
  getFiles!: Sequelize.HasManyGetAssociationsMixin<File>;
  setFiles!: Sequelize.HasManySetAssociationsMixin<File, FileId>;
  addFile!: Sequelize.HasManyAddAssociationMixin<File, FileId>;
  addFiles!: Sequelize.HasManyAddAssociationsMixin<File, FileId>;
  createFile!: Sequelize.HasManyCreateAssociationMixin<File>;
  removeFile!: Sequelize.HasManyRemoveAssociationMixin<File, FileId>;
  removeFiles!: Sequelize.HasManyRemoveAssociationsMixin<File, FileId>;
  hasFile!: Sequelize.HasManyHasAssociationMixin<File, FileId>;
  hasFiles!: Sequelize.HasManyHasAssociationsMixin<File, FileId>;
  countFiles!: Sequelize.HasManyCountAssociationsMixin;
  // Account hasMany Flag via AccountId
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
  // Account belongsTo File via ProfileFileId
  ProfileFile!: File;
  getProfileFile!: Sequelize.BelongsToGetAssociationMixin<File>;
  setProfileFile!: Sequelize.BelongsToSetAssociationMixin<File, FileId>;
  createProfileFile!: Sequelize.BelongsToCreateAssociationMixin<File>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Account {
    return Account.init({
    Id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    Username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "UQ_Account_Username"
    },
    Email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "UQ_Account_Email"
    },
    Password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Role: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    IsDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    ProfileFileId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'file',
        key: 'Id'
      }
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
    FailedPasswordAttempts: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'account',
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
        name: "UQ_Account_Email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Email" },
        ]
      },
      {
        name: "UQ_Account_Username",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Username" },
        ]
      },
      {
        name: "FK_Account_ProfileFileId",
        using: "BTREE",
        fields: [
          { name: "ProfileFileId" },
        ]
      },
    ]
  });
  }
}

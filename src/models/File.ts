import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Account, AccountId } from './Account';

export interface FileAttributes {
  Id: number;
  UploadedById?: number;
  FileName: string;
  FilePath: string;
  FileSize?: number;
  MimeType?: string;
  UploadedAt?: Date;
  IsDeleted: number;
}

export type FilePk = "Id";
export type FileId = File[FilePk];
export type FileOptionalAttributes = "Id" | "UploadedById" | "FileSize" | "MimeType" | "UploadedAt" | "IsDeleted";
export type FileCreationAttributes = Optional<FileAttributes, FileOptionalAttributes>;

export class File extends Model<FileAttributes, FileCreationAttributes> implements FileAttributes {
  Id!: number;
  UploadedById?: number;
  FileName!: string;
  FilePath!: string;
  FileSize?: number;
  MimeType?: string;
  UploadedAt?: Date;
  IsDeleted!: number;

  // File belongsTo Account via UploadedById
  UploadedBy!: Account;
  getUploadedBy!: Sequelize.BelongsToGetAssociationMixin<Account>;
  setUploadedBy!: Sequelize.BelongsToSetAssociationMixin<Account, AccountId>;
  createUploadedBy!: Sequelize.BelongsToCreateAssociationMixin<Account>;
  // File hasMany Account via ProfileFileId
  Accounts!: Account[];
  getAccounts!: Sequelize.HasManyGetAssociationsMixin<Account>;
  setAccounts!: Sequelize.HasManySetAssociationsMixin<Account, AccountId>;
  addAccount!: Sequelize.HasManyAddAssociationMixin<Account, AccountId>;
  addAccounts!: Sequelize.HasManyAddAssociationsMixin<Account, AccountId>;
  createAccount!: Sequelize.HasManyCreateAssociationMixin<Account>;
  removeAccount!: Sequelize.HasManyRemoveAssociationMixin<Account, AccountId>;
  removeAccounts!: Sequelize.HasManyRemoveAssociationsMixin<Account, AccountId>;
  hasAccount!: Sequelize.HasManyHasAssociationMixin<Account, AccountId>;
  hasAccounts!: Sequelize.HasManyHasAssociationsMixin<Account, AccountId>;
  countAccounts!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof File {
    return File.init({
    Id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    UploadedById: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'account',
        key: 'Id'
      }
    },
    FileName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    FilePath: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    FileSize: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true
    },
    MimeType: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    UploadedAt: {
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
    tableName: 'file',
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
        name: "FK_File_UploadedById",
        using: "BTREE",
        fields: [
          { name: "UploadedById" },
        ]
      },
      {
        name: "IDX_IsDeleted",
        using: "BTREE",
        fields: [
          { name: "IsDeleted" },
        ]
      },
    ]
  });
  }
}

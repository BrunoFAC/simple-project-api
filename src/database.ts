import { initModels } from 'models/init-models';
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
    process.env.DATABASE_NAME!,
    process.env.DATABASE_USERNAME!,
    process.env.DATABASE_PASSWORD,
    {
        dialect: process.env.DATABASE_DIALECT! as any,
        storage: process.env.DATABASE_STORAGE!,
        logging:
            // eslint-disable-next-line no-console
            process.env.NODE_ENV === 'development' ? console.log : false,
        define: {
            timestamps: false,
        },
    },
);

sequelize.addHook('beforeCount', options => {
    // eslint-disable-next-line no-param-reassign
    if (!(options as any).preHookInclude) options.include = undefined;
});

sequelize.authenticate();

const dataContext = initModels(sequelize);

export default dataContext;

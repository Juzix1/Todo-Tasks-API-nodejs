import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const Message = sequelize.define('Message', {
    id: {
        type:DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    message: {
        type:DataTypes.TEXT,
        allowNull: false,
    }
});
export default Message;
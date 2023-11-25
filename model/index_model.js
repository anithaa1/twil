module.exports = (sequelize, Sequelize) => {

    const user = sequelize.define("user", {
        id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                 primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email:{
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique:true
                },
                password:{
                    type: Sequelize.STRING
                },
                salt:{

                    type: Sequelize.STRING
                },
                token:{
                    type: Sequelize.STRING
                },
                refresh_Token: {
                    type: Sequelize.STRING
                },
                phone_number:{
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    unique:true
                }
            
            });
            return user;
        };
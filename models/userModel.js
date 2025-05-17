const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs'); // Importa bcryptjs


const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            const hash = bcrypt.hashSync(value, 10);
            this.setDataValue('password', hash);
        }
    },
    role: {
        type: DataTypes.ENUM('Estudiante', 'Docente', 'Administrativo', 'Desarrollo'),
        allowNull: false,
        defaultValue: 'Estudiante'
    },
    id_docente: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            docenteRequired(value) {
                if (this.role === 'Docente' && !value) {
                    throw new Error('id_docente es requerido para docentes');
                }
                if (this.role !== 'Docente' && value) {
                    throw new Error('id_docente solo aplica para docentes');
                }
            }
        }
    },
    num_control: {
        type: DataTypes.STRING(10),
        allowNull: true,
        validate: {
            estudianteRequired(value) {
                if (this.role === 'Estudiante' && !value) {
                    throw new Error('num_control es requerido para estudiantes');
                }
                if (this.role !== 'Estudiante' && value) {
                    throw new Error('num_control solo aplica para estudiantes');
                }
            }
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'users',
    timestamps: true,
    hooks: {
        beforeValidate: (user) => {
            // Limpiar campos no aplicables
            if (user.role !== 'Docente') user.id_docente = null;
            if (user.role !== 'Estudiante') user.num_control = null;
        }
    }
});

// En tu archivo de asociaciones
/*
User.belongsTo(models.Docente, {
    foreignKey: 'id_docente',
    as: 'docente',
    constraints: false // Para permitir valores nulos
});

User.belongsTo(models.Estudiante, {
    foreignKey: 'num_control',
    as: 'estudiante',
    constraints: false
});*/

module.exports = User; 
const User = require ('../models/userModel');

//crear un nuevo usuario
exports.createUser = async (req, res) => {
    try{
        const {nombre, email, password, role, id_docente, num_control } = req.body;
        // Validacion adicional para roles administrativo y desarrollo
        if(['Administrativo', 'Desarrollo'].includes(role)){
            if(id_docente || num_control){
                return res.status(400).json({
                    error: 'Los usuarios ${role} no deben tener id_dicente ni  num_control'
                });
            }
        }

        const newUser = await User.create({
            nombre, 
            email, 
            password,
            role,
            id_docente: role === 'Docente' ? id_docente : null,
            num_control: role === 'Estudiante' ? num_control : null
        });

 const safeUser = {
            id: newUser.id,
            nombre: newUser.nombre,
            email: newUser.email,
            role: newUser.role,
            id_docente: newUser.id_docente,
            num_control: newUser.num_control,
            createdAt: newUser.createdAt
        };   
                res.status(201).json(safeUser);

     } catch (error){
        res.status(400).json({error: error.message});
        console.error('Error al crear el usuario:', error);
    }
};

//obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try{
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error){
        res.status(400).json({error: error.message});
    }
};

//obtener un uduario por ID
exports.getUserById = async (req, res) => {
    try{
        const user = await User.findByPk(req.params.id);
        if(!user){
            return res.status(404).json({error: 'Usuario no encontrado'});
        }
        res.status(200).json(user);
    }catch(error){
        res.status(400).json({error: error.message});
    }
};

//Actualizar un usuario
exports.updateUser = async (req, res) => {
    try {
        const {nombre, email, password} = req.body;
        const [updated] = await User.update(
            {nombre, email, password},
            {where: {id: req.params.id}}
        );
        if(updated){
            const updateUser = await User.findByPk(req.params.id);
            return res.status(200).json(updateUser);
        }
        throw new Error('Usuario no encontrado');
    } catch (error){
        res.status(400).json({error: error.message});
    }
};

//Eliminar un usuario
exports.deleteUser = async (req, res) => {
    try {
        const deleted = await User.destroy({where: {id: req.params.id}});
        if(deleted){
            return res.status(204).send();
        }
        throw new Error('Usuario no encontrado');
    } catch (error){
        res.status(400).json({error: error.message});
    };
}
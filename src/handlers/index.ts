import type { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import slug from 'slug'
import { hashPassword } from '../utils/auth'
import User from "../models/User"

export const createAccount = async (req : Request, res: Response ) => {

    // Manejo de errores
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    return

    const { email, password } = req.body
    const userExist = await User.findOne( { email } )

    if (userExist) {
        const error = new Error('El usuario ya está registrado')
        return res.status(409).json( { error : error.message } )
    }

    const handle = slug( req.body.handle, '' )
    const handleExist = await User.findOne({ handle })
    if( handleExist ){
        const error = new Error('El Nombre de usuario no está disponible')
        return res.status(409).json({ error: error.message })
    }

    const user = new User( req.body )
    user.password = await hashPassword( password )
    user.handle = handle

    await user.save()
    res.status(401).send('Registro creado correctamente')
}
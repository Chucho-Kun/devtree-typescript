import type { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import slug from 'slug'
import { hashPassword, checkPassword } from '../utils/auth'
import User from "../models/User"
import { generateJWT } from "../utils/jwt"

export const createAccount = async (req : Request, res: Response ) => {

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
    res.status(201).send('Registro creado correctamente')
}

export const login = async ( req: Request, res: Response ) => {

    const { email, password } = req.body

    // Validar que el correo exista
    const user = await User.findOne({ email })
    if(!user){
        const error = new Error('El usuario no existe')
        return res.status(401).json({ error:error.message })
    }
    
    // Comprobar password
    const isPasswordCorrect = await checkPassword( password, user.password )
    
    if(!isPasswordCorrect){
        const error = new Error('El password es incorrecto')
        return res.status(401).json({ error:error.message })
    }

    const token = generateJWT({ id: user._id })

    res.send( token )
}

export const getUser = async ( req: Request, res: Response ) => {
    console.log('desde getUser');
    res.json( req.user )
}
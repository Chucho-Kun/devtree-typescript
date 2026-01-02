import { Router } from 'express'
import { body } from 'express-validator'
import { handleInputErrors } from './middleware/validation'
import { createAccount, login, getUser, updateProfile } from './handlers'
import { authenticate } from './middleware/auth'

const router = Router()

// Autenticacion y Registro
router.post('/auth/register', 
    body('handle')
        .notEmpty()
        .withMessage('El handle no puede ir vacio...'),
    body('name')
        .notEmpty()
        .withMessage('El nombre no puede ir vacio...'),
    body('email')
        .isEmail()
        .withMessage('Email no válido'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('El password debe tener almenos 8 caracteres'),
        handleInputErrors,
        createAccount )
        
router.post('/auth/login',
    body('email')
        .isEmail()
        .withMessage('Email no válido'),
    body('password')
        .notEmpty()
        .withMessage('El password es obligatorio'),
        handleInputErrors,
        login )

router.get('/user', authenticate, getUser)
router.patch('/user', 
    body('handle')
        .notEmpty()
        .withMessage('El handle no puede ir vacío'),
    body('description')
        .notEmpty()
        .withMessage('La descripción no puede ir vacía'),
    authenticate, 
    updateProfile
)

export default router
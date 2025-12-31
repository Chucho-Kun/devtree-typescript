import jwt, { type JwtPayload }  from 'jsonwebtoken'

export const generateJWT = (payload: JwtPayload) => {
    console.log(payload);
    const token = jwt.sign( payload, process.env.JWT_SECRET , {
        expiresIn: '180d'
    })
    return token
}
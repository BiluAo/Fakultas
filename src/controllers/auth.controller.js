import UserModel from '../model/user.model.js'
import { loginSchema, registerSchema } from '../schemas/auth.schema.js'
import { PasswordHelper } from '../utils/bcrypt.js'
import { JwtHelper } from '../utils/jwt.js'
import { apiResponse, apiResponseValidation } from '../utils/response.js'

class AuthController {
    static async register(req, res) {
        const result = registerSchema.safeParse(req.body)

        if (!result.success) {
            return apiResponseValidation({
                res,
                errors: result.error
            })
        }
        const { name, email, password } = result.data

        const newUser = await UserModel.create({
            name,
            email,
            password: await PasswordHelper.hash(password),
        })
        return apiResponse({
            res,
            status: 201,
            message: 'Register berhasil',
            data: {
                user: {
                    _id: newUser._id,
                    name,
                    email
                }
            }
        })
    }
    static async login(req, res) {
        const result = loginSchema.safeParse(req.body)

        if (!result.success) {
            return apiResponseValidation({
                res,
                errors: result.error
            })
        }
        const { email, password } = result.data;

        const user = await UserModel.findOne({
            email
        }).select("+password")
        if (!user) {
            return apiResponse({
                res,
                status: 401,
                message: "Email atau Password tidak Valid"
            })

        }
        const passwordIsValid = await PasswordHelper.compare(password, user.password)
        console.log(password)
        console.log(user.password)

        if (!passwordIsValid) {
            return apiResponse({
                res,
                status: 401,
                message: "Email atau Password tidak Valid"
            })
        }
        const accessToken = await JwtHelper.sign({
            sub: user._id.toString()
        })
        return apiResponse({
            res,
            status: 200,
            message: "Login Berhasil",
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                },
                access_token: accessToken
            }
        })
    }
}
export default AuthController
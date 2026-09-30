import fakultasModel from "../model/fakultas.model.js"
import { apiResponse } from "../utils/response.js"

class FakultasController {
    static async index(req, res) {
        const listFakultas = await fakultasModel.find()
        return apiResponse({
            res,
            status : 200,
            message : "List Fakultas",
            data : listFakultas,
        })
    }

    static async show(req, res) {
        const fakultasId = req.params.id

        const fakultas = await fakultasModel.findById(fakultasId)

        return apiResponse({
            res,
            status: 200,
            message : "Detail Fakultas",
            data : fakultas
        })
    }
    static async store(req,res){
        const {name}= req.body

        const fakultas = await fakultasModel.create({
            name : name
        })

        return apiResponse({
            res,
            status: 200,
            message : 'Fakultas berhasil dibuat',
            data : fakultas
        })
    }
}

export default FakultasController
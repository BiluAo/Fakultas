import mongoose from "mongoose"
import fakultasModel from "../model/fakultas.model.js"
import { storeProdiSchema, updateProdiSchema } from "../schemas/prodi.schema.js"
import { apiResponse, apiResponseValidation } from "../utils/response.js"
import ProdiModel from "../model/prodi.model.js"
import { promise } from "zod"

class ProdiController {
    static async index(req, res) {

        const { search, sort, sortBy = "createdAt", page = 1, limit = 10 } = req.query

        const currentPage = Math.max(1, parseInt(page, 10) || 1);
        const perPage = Math.max(1, parseInt(limit, 10) || 10);
        const skip = (currentPage - 1) * perPage;

        const allowedSortFields = ["kode", "nama_prodi", "createdAt", "updatedAt"];
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

        const filter = {}

        const sortOption = {
            [sortField]: sort === "desc" ? -1 : 1,
        };

        if (search) {
            filter.nama_prodi = {
                $regex: search,
                $options: "i",
            };
        }

        const [listProdi, totalDat] = await Promise.all([
            ProdiModel.find(filter)
                .select({
                    _id: 1,
                    kode: 1,
                    nama_prodi: 1,
                    fakultas: 1,
                    createdAt: 1,
                    updatedAt: 1
                })
                .sort(sortOption)
                .skip(skip)
                .limit(perPage)
                .populate("Fakultas")
        ])

        const totalPages = Math.ceil(totalData / perPage);
        return apiResponse({
            res,
            status: 200,
            message: "List prodi",
            data: {
                items: listProdi,
                pagination: {
                    totalData,
                    totalPages,
                    currentPage,
                    perPage,
                    hasNextPage: currentPage < totalPages,
                    hasPrevPage: currentPage > 1,
                }

            }
        })
    }
    static async show(req, res) { }

    static async store(req, res) {
        const result = storeProdiSchema.safeParse(req.body)

        if (!result.success) {
            return apiResponseValidation({
                res,
                errors: result.error
            })
        }
        const { kode, nama_prodi, fakultas_id } = result.data
        const isExists = await fakultasModel.exists({
            _id: new mongoose.Types.ObjectId(fakultas_id)
        })
        if (!isExists) {
            return apiResponse({
                res,
                status: 404,
                message: "Fakultas tidak ada"

            })
        }
        const newProdi = await ProdiModel.create({
            kode,
            nama_prodi,
            fakultas: fakultas_id
        });
        return apiResponse({
            res,
            status: 201,
            message: "Prodi berhasil di buat",
            data: newProdi
        })
    }

    static async update(req, res) {
        const prodiId = req.params.id;
        const result = updateProdiSchema.safeParse(req.body)

        if (!result.success) {
            return apiResponseValidation({
                res,
                errors: result.error
            })
        }
        const prodi = await ProdiModel.findById(prodiId)
        if (!prodi) {
            return apiResponse({
                res,
                status: 404,
                message: "Prodi Tidak Ada",
                data: null
            })
        }
        const { kode, nama_prodi, fakultas_id } = result.data

        if (fakultas_id) {
            const isExits = await fakultasModel.exists({
                _id: new mongoose.Types.ObjectId(fakultas_id)

            })
            if (!isExits) {
                return apiResponse({
                    res,
                    status: 404,
                    message: "Fakultas Tidak Ada",
                    data: null
                })
            }

        }
        const updateProdi = await ProdiModel.findByIdAndUpdate(prodiId, {
            kode: kode,
            nama_prodi: nama_prodi,
            fakultas: fakultas_id
        }, {
            new: true,
        }).populate("fakultas")

        return apiResponse({
            res,
            status: 200,
            message: "Data Berhasil Di Update",
            data: updateProdi
        })
    }

    static async delete(req, res) {
        const prodiId = req.params.id
        const prodi = await ProdiModel.findByIdAndDelete(prodiId)

        if (!prodi) {
            return apiResponse({
                res,
                status: 404,
                message: "Prodi Tidak ada",
                data: null
            })

        }
        return apiResponse({
            res,
            status: 200,
            message: "prodi berhasil di hapus",
            data: null
        })
    }
}
export default ProdiController
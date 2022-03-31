const express = require('express')
const bcrypt = require('bcryptjs')
const User = require("../models/User")
const TokenService = require("../services/token.service")
const tokenService = require('../services/token.service')


// ПРОТЕТИРОВАТЬ код, затем удалить из БД значения, которые мы записали (user и tokens)
// Написать код из 3 урока

const router = express.Touter({ mergeParams: true })

/* --- РЕГИСТРАЦИЯ --- */

router.post('/signUp', async (req, res) => {
    try {
        const { email, password } = req.body
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ error: { message: 'EMAIL_EXISTS', code: 400 } })
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const newUser = User.create({
            ...req.body,
            paswword: hashedPassword,
        })

        const tokens = tokenService.generate({ _id: newUser._id })
        await tokenService.save(newUser._id, tokens.refreshToken)

        res.status(201).send({ ...tokens, userId: newUser._id })

    } catch (error) {
        res.status(500).json({ message: 'На сервере произошла ошибка. Попробуйте позже' })
    }
})

/* --- ВАЛИДАЦИЯ --- */

router.post('/signInWithPassword', [
    check('email', 'Email некорректный').normalizeEmail().isEmail(),
    check('password', 'Парол не может быть пустым').exists(),
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: {
                        message: 'IVALID_DATA',
                        code: 400
                    }
                })
            }
            const { email, password } = req.body

            const existingUser = await User.findOne({ email })
            if (!existingUser) {
                return res.status(400).send({ error: { message: 'EMAIL_NOT_FOUND', code: 400 } })
            }

            const isPasswordEqual = bcrypt.compare(password, existingUser.password)
            if (!isPasswordEqual) {
                return res.status(400).send({ error: { message: 'INVALID_PASSWORD', code: 400 } })
            }

            const tokens = tokenService.generate({ _id: existingUser._id })
            await tokenService.save(newUser._id, tokens.refreshToken)
            res.status(200).send({ ...tokens, userId: existingUser._id })


        } catch (error) {
            res.status(500).json({ message: 'На сервере произошла ошибка. Попробуйте позже' })
        }
    }])

/* --- ТОКЕНЫ --- */

function isTokenValid(data, dbToken) {
    return !data || !dbToken || data._id !== dbToken?.user?.toString()
}

router.post('/token', async (req, res) => {
    try {
        const { refresh_token: refreshToken } = req.body
        const data = tokenService.validateRefresh(refreshToken)
        const dbToken = await tokenService.findToken(refreshToken)

        if (isTokenValid(data, dbToken)) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const tokens = tokenService.generate({ _id: data._id })
        await tokenService.save(data._id, tokens.refreshToken)
        res.status(200).send({ ...tokens, userId: data._id })

    } catch (error) {
        res.status(500).json({ message: 'На сервере произошла ошибка. Попробуйте позже' })
    }
})

module.exports = router

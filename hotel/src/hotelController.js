const Hotel = require('./app')

const createHotel = async (req, res) => {
    res.send('create hotel')
}
const updateHotel = async (req, res) => {
    res.send('update hotel')
}
const deleteHotel = async (req, res) => {
    res.send('delete hotel')
}
const getAllHotels = async (req, res) => {
    res.send('all hotel')
}

const getSingleHotel = async (req, res) => {
    res.send('get single hotel')
}

module.exports = {
    getAllHotels, deleteHotel, createHotel, getSingleHotel, updateHotel
}

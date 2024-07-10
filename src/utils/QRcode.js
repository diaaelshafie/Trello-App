import QRcode from 'qrcode'

export const QRCodeGen = async ({ data = {} } = {}) => {
    // we use the method below to make the qr as an url
    // we use the JSON.stringify to make sure the data is converted into string
    const qrCode = await QRcode.toDataURL(JSON.stringify(data)
        , {
            errorCorrectionLevel: 'H'
        })
    return qrCode
}
const mailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const qrcode = require('qrcode');

module.exports = function(token, id) {

    qrcode.toFile('C:/device_care/qr_code/code.png', ''+id,{
        color: {
            dark: '#000000',
            light: '#ffffff',
        }, function(err) {
            if (err) throw err
            console.log('QR Code created');
        }
    })

    const decoded = jwt.decode(token, process.env.JWT_KEY);
    const email = decoded.email;

    var transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'devicecare24@googlemail.com',
            pass: 'Tatzend07745'
        }
    });

    var mailOptions = {
        from: 'devicecare24@googlemail.com',
        to: 'nessenmaxi@googlemail.com',
        subject: 'QR Code Device Care',
        html: '<h1>Thanks for using DeviceCare<h1><p>Your device was created and you can download a QR Code for scanning via the attachment<p>',
        attachments: [{
            filename: "qr-code.png",
            path: "C:/device_care/qr_code/code.png",
            cid: "qr-code.png"
        }]
    };

    console.log('Sending Mail');
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
}
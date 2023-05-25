import express = require('express');
import bodyParser = require('body-parser');
import cors = require('cors');
import nodemailer = require('nodemailer');

const app: express.Application = express();

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.use(cors());

const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: "deividcapragiu@gmail.com",
        pass: 'jttuefunnkmmhmlq',
    },
    secure: true
});

const otpMap = new Map<string, string>();

app.post("/get-otp", (req, res) => {
    const email: string = req.body.email;
    
    otpMap.set(
        email,
        Math.random().toString(36).slice(-8)
    );

    setTimeout(() => {
        //! Invalidate otp after 5 minutes
        otpMap.delete(email);
    }, 300000);

    const mailData = {
        from: 'acslife.ip@gmail.com',
        to: email,
        subject: "Cod autentificare ACS Life",
        html: `<p>Codul tău de autentificare este: ${otpMap.get(email)}</p>`
    }
    transporter.sendMail(mailData, (error, _) => {
        if (error) {
            otpMap.delete(email);
            console.log(error);
            res.status(501).send({status: "failed"});
            return;
        }
        return res.status(200).send({status: "success"});
    });
});

app.post("/verify-otp", (req, res) => {
    const { otp, email } = req.body;

    const actualOtp = otpMap.get(email);

    if (actualOtp && otp === actualOtp) {
        otpMap.delete(email);
        res.send({status: "success"});
    } else {
        res.status(501).send({status: "failed"});
    }
});

const port = process.env.PORT || 4000 

app.listen(port, () => {
    console.log("Server is up at", port);
});
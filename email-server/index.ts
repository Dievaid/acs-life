import express = require('express');
import bodyParser = require('body-parser');
import cors = require('cors');
import nodemailer = require('nodemailer');
import bcrypt = require('bcrypt');

require('dotenv').config();

const { Client } = require('pg');

const clientData = {
    user: process.env.user,
    host: process.env.host,
    database: process.env.db,
    password: process.env.pwd,
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
};

const client = new Client(clientData);

client.connect((err: any) => {
    if (err) throw err;
    const createTableSql = `
        CREATE TABLE IF NOT EXISTS AUTH (
            email varchar(255) PRIMARY KEY,
            otp varchar(255)
        )
    `;
    const deleteTableSql = 'DELETE FROM AUTH';
    client.query(createTableSql).then(() =>
        client.query(deleteTableSql).then(() => console.log("Connected and init done!")))
});

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
        user: process.env.smtp,
        pass: process.env.passsmtp,
    },
    secure: true
});

app.post("/get-otp", async (req, res) => {
    const email: string = req.body.email;
    const otp = (Math.floor(Math.random() * 900000) + 100000).toString();

    const deleteIfHashExistsAlready = `DELETE FROM AUTH WHERE email = $1`;
    await client.query(deleteIfHashExistsAlready, [email]);
    
    bcrypt.hash(otp, 10, (err, hash) => {
        if (err) return;
        const insertSql = 'INSERT INTO AUTH (email, otp) values ($1, $2)';
        client.query(insertSql, [email, hash]).then(() => {
            setTimeout(async () => {
                //! Invalidate otp after 5 minutes
                const deleteSql = 'DELETE FROM AUTH WHERE email = $1';
                await client.query(deleteSql, [email]);
            }, 300000);
        });
    });

    const mailData = {
        from: 'acslife.ip@gmail.com',
        to: email,
        subject: "Cod autentificare ACS Life",
        html: `<p>Codul tău de autentificare este: ${otp}</p>`
    }
    transporter.sendMail(mailData, (error, _) => {
        if (error) {
            console.log(error);
            res.status(501).send({status: "failed"});
            return;
        }
        return res.status(200).send({status: "success"});
    });
});

app.post("/verify-otp", (req, res) => {
    const { otp, email } = req.body;

    const getOtpSql = 'select otp from auth where email = $1';
    client.query(getOtpSql, [email])
    .then((data: any) => {
        try {
            const actualOtp = data.rows[0].otp;
            bcrypt.compare(otp, actualOtp, (err, same) => {
                if (err) throw err;

                if (same) {
                    const deleteOtp = `DELETE FROM AUTH WHERE email = $1`;
                    client.query(deleteOtp, [email]).then(() => res.send({status: "success"}));
                } else {
                    res.status(400).send({status: "failed"});
                }
            })
        }
        catch {
            res.status(400).send({status: "failed"});
        }
    });
});

const port = process.env.PORT || 4000 

app.listen(port, () => {
    console.log("Server is up at", port);
});

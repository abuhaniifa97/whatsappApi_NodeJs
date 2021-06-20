const { Client } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');
const socketIO = require('socket.io');
const fs = require('fs');
const http = require('http');
const client = new Client();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
// Session


const SESSION_FILE_PATH = './wa-session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}
// Run Apps
app.get('/',(req,res)=>{
    res.sendFile('index.html',{root:__dirname});
});
// Akhir Run Apps
const clientt = new Client({ puppeteer: { headless: true }, session: sessionCfg });
// Akhir Session


// Auth
client.on('authenticated', (session) => {
    console.log('AUTHENTICATED', session);
    sessionCfg=session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});
// Akhir Auth



client.on('message', msg => {
    if (msg.body == 'Belanja') {
        msg.reply('Selamat Datang Ditoko Saya : Amanah Toko. Untuk melihat daftar menu ketik (1)');
    }else if(msg.body == '1'){
        msg.reply('Makanan(Mk),Minuman(Mm),Bumbu Dapur(Bd). Silahkan ketikan kode yang mau dipesan');
        // Makanan
    }else if(msg.body == 'Mk'){
        msg.reply('=>Baso Kuah(Bk) : Rp.10.000/Porsi,=>Mie Ayam(Ma) : Rp.15.000/Porsi,=>Sate(St) : Rp.2000/tusuk. Silahkan ketikan kode yang mau dipesan');
    }else if(msg.body == 'Bk'){
        msg.reply("Anda memilih Baso kuah(Bk). Total Belanja anda : Rp.10.000/porsi, ketik 'Bayar' untuk mengakhir pesanan");
    }else if(msg.body == 'Ma'){
        msg.reply("Anda memilih Mie Ayam(Ma). Total Belanja anda : Rp.15.000/porsi, ketik 'Bayar' untuk mengakhir pesanan");
    }else if(msg.body == 'St'){
        msg.reply("Anda memilih Sate(St). Total Belanja anda : Rp.2000/tusuk, ketik 'Bayar' untuk mengakhir pesanan");
        // Akhir Makanan
    }else if(msg.body == 'Mm'){
        msg.reply('=>Teh Manis(Tm) : Rp.5.000/cup,=>Es Jeruk(Ej) : Rp.10.000/cup,=>Jus(Js) : Rp.5.000/cup. Silahkan ketikan kode yang mau dipesan');
        // Minuman
    }else if(msg.body == 'Tm'){
        msg.reply("Anda memilih Teh manis(Tm). Total Belanja anda : Rp.5.000/cup, ketik 'Bayar' untuk mengakhir pesanan");
    }else if(msg.body == 'Ej'){
        msg.reply("Anda memilih Es Jeruk(EJ). Total Belanja anda : Rp.10.000/cup, ketik 'Bayar' untuk mengakhir pesanan");
    }else if(msg.body == 'Js'){
        msg.reply("Anda memilih Jus(Js). Total Belanja anda : Rp.5.000/cup, ketik 'Bayar' untuk mengakhir pesanan");
        // Akhir Minuman
    }else if(msg.body == 'Bd'){
        msg.reply('=>Telur (tl): Rp.21.000/kg,=>Bawang Merah(Bm) : Rp.20.000/kg,=>Bawang Putih(Bp) : Rp.19.000/kg. Silahkan ketikan kode yang mau dipesan');  
        // Bumbu Dapur
    }else if(msg.body == 'Tl'){
        msg.reply("Anda memilih Telur(Tl). Total Belanja anda : Rp.21.000/kg, ketik 'Bayar' untuk mengakhir pesanan");
    }else if(msg.body == 'Bp'){
        msg.reply("Anda memilih Bawang Putih(Bp). Total Belanja anda : Rp.19.000/kg, ketik 'Bayar' untuk mengakhir pesanan");
    }else if(msg.body == 'Bm'){
        msg.reply("Anda memilih Bawang Merah(Bm). Total Belanja anda : Rp.20.000/kg, ketik 'Bayar' untuk mengakhir pesanan");
        // Akhir Bumbu Dapur 

        // Bayar
    }else if(msg.body == 'Bayar'){
        msg.reply("Terima kasih sudah berbelanja ditoko kami,silahkan ditunggu pesanannya");
    } else {
        msg.reply("Mohon maaf keyword yang anda kirim tidak ditemukan. Untuk memulai berberlanja ketik 'Belanja'");
    }
});

client.initialize();
// Socket IO CONN
io.on('connection',function(socket){
    socket.emit('message','Connection....');

    client.on('qr', (qr) => {
        // Generate and scan this code with your phone
        console.log('QR RECEIVED', qr);
        qrcode.toDataURL(qr,(err,url)=>{
            socket.emit('qr',url);
            socket.emit('message','Please Scan');
        });
    });
    client.on('ready', () => {
        socket.emit('message','Whatsapp Is Ready');
    
    }); 
});
server.listen(8000, function(){
    console.log('Apps Running');
})
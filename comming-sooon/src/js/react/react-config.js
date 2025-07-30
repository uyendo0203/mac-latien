// Lấy baseUrl từ input hidden
const baseUrl = document.getElementById('baseUrl')?.value || 'http://pbcm2.pxt.vn'; 

const siteKeyCaptcha = "6Lf7sGErAAAAAHCyGbwxmVYjPMCbvOecmauj59Uh"; // Khóa site cho reCAPTCHA v2

const percentToWin = 0.15; // xác suất thắng là 15%

const timeToBackToStartGame = 10000; // start lại game sau 10s khi kết thúc


export { baseUrl, siteKeyCaptcha, percentToWin, timeToBackToStartGame };
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const main_1 = require("./main");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (req, res) => {
    return res.json({
        message: "Servidor TypeScript rodando na porta 3030 🚀"
    });
});
(0, main_1.bootstrap)();
const PORT = 3030;
app.listen(PORT, () => {
    console.log(`🔥 Server running on port ${PORT}`);
});

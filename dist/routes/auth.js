"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.send('Hello auth!');
});
router.get('/signin', (req, res) => {
    res.send('Hello sign in!');
});
router.get('/signup', (req, res) => {
    res.send('Hello sign up!');
});
exports.default = router;

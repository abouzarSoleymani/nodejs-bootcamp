const { body, validationResult } = require('express-validator')
const loginValidator = () => {
    return [
        // username must be an email
        body('email').isEmail().withMessage('فیلد ایمیل معتبر نیست'),
        // password must be at least 6 chars long
        body('password').isLength({ min: 8 }).withMessage('فیلد پسورد نمی تواند کمتر از 8 کاراکتر باشد'),
    ]
}
module.exports = loginValidator;

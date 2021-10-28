const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }

        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const filename = file.originalname.replace(' ', '-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${filename}-${Date.now()}.${extension}`);
    },
});

const uploadOptions = multer({ storage: storage });

router.get(`/`, productController.getProducts);

router.get(`/:id`, productController.getProductById);

router.post(`/`, uploadOptions.single('image'), productController.addProduct);

router.put(
    '/:id',
    uploadOptions.single('image'),
    productController.editProduct
);

router.delete('/:id', productController.deleteProduct);

router.get(`/get/count`, productController.getProductsCount);

router.get(`/get/featured/:count`, productController.getFeaturedProducts);

router.put(
    '/gallery-images/:id',
    uploadOptions.array('images', 10),
    productController.addImagesToProduct
);

module.exports = router;

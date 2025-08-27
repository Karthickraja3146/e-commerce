import { v2 as cloudinary } from 'cloudinary';
import productModel from "../models/productModel.js"; 

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    const images = [];
    for (let i = 1; i <= 4; i++) {
      if (req.files[`image${i}`]) {
        images.push(req.files[`image${i}`][0]);
      }
    }

    const imageUrl = await Promise.all(
      images.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, { resource_type: 'image' });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      price: Number(price),
      image: imageUrl,
      category,
      subCategory,
      sizes: sizes ? JSON.parse(sizes) : [],
      date: Date.now(),
      bestseller: bestseller === "true",
    };

    await productModel.create(productData);
    res.json({ success: true, message: "Product Added Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product Deleted Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const singleProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { addProduct, listProduct, removeProduct, singleProduct };

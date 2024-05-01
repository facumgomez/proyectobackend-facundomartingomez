import productsModel from "../dao/models/productsModel.js"
import { request, response } from "express";


export const getProducts = async (req=request, res=response) => {
  try {
    const { limit } = req.query;
    const [products, total] = await Promise.all([productsModel.find().limit(Number(limit)), productsModel.countDocuments()]);
    return res.json({total, products});
  } catch (error){
    console.log('getProoducts', error);
    return res.status(400).json({message:'El documento no tiene un formato válido.'});
  };
};

export const getProductsById = async (req=request, res=response) => {
  try {
    const {pid} = req.params;
    const product = await productsModel.findById (pid);
    if (!product)
      return res.status(400).json({message: `Producto no encontrado con id ${pid}`});
    return res.json({product});
  } catch (error){
    console.log('getProoducts', error);
    return res.status(400).json({message:'El documento no tiene un formato válido.'});
  };
};

export const createProducts = async (req=request, res=response) => {    console.log(req.body)
  try {
    const {title, category, thumbnail, description, price, code, stock, status} = req.body;
    if (!title || !category || !thumbnail || !description || !price || !code || !stock)
      return res.status(400).json({message: 'Código no disponible'});
    const product = await productsModel.create({...req.body});
    return res.json({product});
  } catch (error){
    console.log('createProoducts', error);
    return res.status(400).json({message:'El documento no tiene un formato válido.'});
  };
};

export const updateProduct = async (req=request, res=response)  => {
  try {
    const {pid} = req.params;
    const {_id, ...rest} = req.body;
    const product = await productsModel.findByIdAndUpdate(pid, {...rest}, {new: true});
      if(product)
        return res.json({message: 'Producto actualizado', product});
      return res.status(400).json({message: `Imposible actualizar producto con id ${pid}`});
  } catch (error){
    console.log('deleteProduct', error);
    return res.status(400).json({message:'El documento no tiene un formato válido.'});
  };
};

export const deleteProduct = async (req=request, res=response)  => {
  try {
    const {pid} = req.params;
    const product = await productsModel.findByIdAndDelete(pid);
      if(product)
        return res.json({message: 'Producto eliminado', product});
      return res.status(400).json({message: `Imposible elimanar producto con id ${pid}`});
  } catch (error){
    console.log('deleteProduct', error);
    return res.status(400).json({message:'El documento no tiene un formato válido.'});
  };
};
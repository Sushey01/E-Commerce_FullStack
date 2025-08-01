// src/api/productAPI.js

const BASE_URL = "https://fakestoreapi.com";

export async function getAllProducts() {
  const response = await fetch(`${BASE_URL}/products`);
  return response.json();
}

export async function getProductById(id) {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  return response.json();
}

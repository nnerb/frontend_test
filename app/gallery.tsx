"use client";

import { CSSProperties, useEffect, useState } from "react";
import Modal from "./modal";
import axios from "axios";
import {
  FaRegCircleXmark,
} from "react-icons/fa6";
import Image from "next/image";
import { APIProducts } from "./types/product";

import spinner from "../public/spinner.svg"

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const Gallery = () => {
  const [productsList, setProductsList] = useState<APIProducts[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<APIProducts | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://freetestapi.com/api/v1/products?limit=10")
        setProductsList(response.data)
        setLoading(false)
      } catch (error) {
        setError("Failed to fetch products")
        console.log('Error fetching products: ', error)
      }
    }
    fetchProducts()
  }, [])

  const handleModalOpen = (id: number) => {
    const product = productsList.find((item) => item.id === id) || null

    if (product) {
      setSelectedProduct(product)
      setIsModalOpen(true)
    }
  }

  const handleModalClose = () => {
    setSelectedProduct(null)
    setIsModalOpen(false)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
        <p>Fetching data..</p>
        <Image src={spinner} alt=""/>
      </div>
    )
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="product-gallery">
      <h1 className="heading">Products</h1>
      <div className="items">
        {productsList.map((product) => (
          <div
            className="item product-card"
            key={product.id}
            onClick={() => handleModalOpen(product.id)}
          >
            <div className="body">
              <Image src={product.image} alt={product.name} width={96} height={96} />
            </div>
            <div className="info">
              <div className="name">{product.name}</div>
              <div className="price">${product.price}</div>
            </div>
          </div>
        ))}
        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
          <div className="product-panel">
            <div className="header">
              <div
                role="button"
                tabIndex={0}
                className="close"
                onClick={handleModalClose}
              >
                <FaRegCircleXmark size={32} />
              </div>
            </div>
            <div className="body">
              {selectedProduct && (
                <div className="product-info info">
                  <div className="product-image">
                    <Image src={selectedProduct.image} alt={selectedProduct.name} width={200} height={200} />
                  </div>
                  <div className="product-modal-details">
                    <div className="name section">
                      <span className="header">Name:</span>
                      <span className="info">{selectedProduct.name}</span>
                    </div>
                    <div className="description section">
                      <span className="header section">Description:</span>
                      <span className="info">{selectedProduct.description}</span>
                    </div>
                    <div className="price section">
                      <span className="header">Price:</span>
                      <span className="info">${selectedProduct.price}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default Gallery

import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { categoryPageContent } from '../data/pageContent';
import { productsAPI } from '../services/api';
import { productsByCategory } from '../data/products';
import { canDisplayProductImage, getAssetImage } from '../utils';

export default function CategoryPage({ slug, onAddToCart }) {
  const localProducts = productsByCategory[slug] || [];
  const [products, setProducts] = useState(localProducts);
  const [error, setError] = useState('');
  
  const content = categoryPageContent[slug];

  useEffect(() => {
    async function loadProducts() {
      try {
        setProducts(localProducts);
        const data = await productsAPI.getByCategory(slug);
        const liveProducts = Array.isArray(data) ? data.filter((product) => canDisplayProductImage(product.image)) : [];
        setProducts(liveProducts.length ? liveProducts : localProducts);
        setError('');
      } catch (err) {
        setProducts(productsByCategory[slug] || []);
        setError('');
        console.error('Error loading products:', err);
      }
    }

    loadProducts();
  }, [slug]);

  if (!content) {
    return null;
  }

  return (
    <main>
      <section className="category-hero">
        <div className="category-copy">
          <span className="section-pill">{content.eyebrow}</span>
          <h1>{content.title}</h1>
          <p>{content.intro}</p>
        </div>
        <div className="promo-panel">
          {content.promoImage && (
            <div className="promo-image-wrap">
              <img src={getAssetImage(content.promoImage)} alt={content.promoTitle} />
            </div>
          )}
        </div>
      </section>

      <section className="stats-grid">
        {content.stats.map(([value, label]) => (
          <div className="stat-card" key={`${value}-${label}`}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="section-wrap product-section">
        {error && <div className="warning-banner">{error}</div>}
        <div className="section-head">
          <span className="section-pill">{content.collectionEyebrow}</span>
          <h2>{content.collectionTitle}</h2>
          <p>{content.collectionText}</p>
        </div>
        <div className="product-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))
          ) : (
            <div className="empty-state">
              <p>No products available in this category</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

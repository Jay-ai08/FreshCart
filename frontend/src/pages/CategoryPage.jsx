import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { categoryPageContent } from '../data/pageContent';
import { productsAPI } from '../services/api';
import { productsByCategory } from '../data/products';

export default function CategoryPage({ slug, onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const content = categoryPageContent[slug];

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await productsAPI.getByCategory(slug);
        setProducts(Array.isArray(data) && data.length ? data : (productsByCategory[slug] || []));
        setError('');
      } catch (err) {
        setProducts(productsByCategory[slug] || []);
        setError('Showing local products because backend is not reachable. Start the backend for live database data.');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
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
          <h2>{content.promoTitle}</h2>
          <p>{content.promoText}</p>
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
          {loading ? (
            <div className="empty-state">
              <p>Loading products...</p>
            </div>
          ) : products.length > 0 ? (
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

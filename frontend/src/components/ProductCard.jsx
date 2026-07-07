import { FALLBACK_IMAGE, formatPrice, getAssetImage } from '../utils';

export default function ProductCard({ product, onAddToCart }) {
  const imageUrl = getAssetImage(product.image);

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <span className="product-tag">{product.tag}</span>
        <img src={imageUrl} alt={product.alt || product.name} className="product-image" loading="lazy" onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE; }} />
      </div>
      <div className="product-body">
        <h3>{product.name}</h3>
        <p>{product.desc}</p>
        <div className="product-row">
          <span className="price-label">{formatPrice(product.price)}</span>
          <button type="button" className="primary-small" onClick={() => onAddToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

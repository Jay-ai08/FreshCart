import { categories } from '../data/products';
import LinkButton from '../components/LinkButton';
import { getAssetImage } from '../utils';

const heroProducts = [
  { name: 'Fresh apples', image: 'Fruits&Vegetables/apple.jpeg' },
  { name: 'Broccoli', image: 'Fruits&Vegetables/brocli.jpeg' },
  { name: 'Chilled drinks', image: 'Beverages/fanta.jpeg' },
  { name: 'Dairy milk', image: 'Dairy/milk1.jpeg' },
  { name: 'Crunchy snacks', image: 'snacks/lays1.jpeg' },
  { name: 'Cheese', image: 'Dairy/cheese.jpeg' },
];

const categoryImages = {
  'fruits-vegetables': 'Fruits&Vegetables/apple.jpeg',
  beverages: 'Beverages/fanta.jpeg',
  dairy: 'Dairy/milk1.jpeg',
  snacks: 'snacks/pringles1.jpeg',
};

export default function Home({ onNavigate }) {
  return (
    <main>
      <section className="hero-section">
        <div className="hero-layout">
          <div className="hero-copy">
            <span className="section-pill">Fast delivery - Fresh every day</span>
            <h1>
              Fresh & Organic <span>Groceries</span> to Your Doorstep
            </h1>
            <p>
              Shop your daily essentials from our wide range of categories with best prices, premium freshness, and fast doorstep delivery.
            </p>
            <div className="hero-actions">
              <LinkButton to="/fruits-vegetables" onNavigate={onNavigate} className="primary-button">
                Shop Now
              </LinkButton>
              <a href="#categories" className="secondary-button">Explore Deals</a>
            </div>
            <div className="hero-stats">
              <div><strong>24/7</strong><span>Delivery</span></div>
              <div><strong>4.9</strong><span>Rated Fresh</span></div>
              <div><strong>500+</strong><span>Daily Essentials</span></div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Fresh grocery product display">
            <div className="hero-product-grid">
              {heroProducts.map((product) => (
                <div className="hero-product-tile" key={product.name}>
                  <img src={getAssetImage(product.image)} alt={product.name} />
                </div>
              ))}
            </div>
            <div className="hero-pick-card">
              <strong>Today's pick</strong>
              <span>Organic fruits & premium dairy</span>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="section-wrap">
        <div className="section-head">
          <span className="section-pill">Trending now</span>
          <h2>Shop by Categories</h2>
          <p>Curated essentials for every kitchen, delivered fresh and fast with a premium shopping experience.</p>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <LinkButton
              key={category.slug}
              to={`/${category.slug}`}
              onNavigate={onNavigate}
              className="category-card"
            >
              <span className="category-image-wrap">
                <img src={getAssetImage(categoryImages[category.slug])} alt={category.title} className="category-image" />
              </span>
              <span className="category-badge">{category.badge}</span>
              <h3>{category.title}</h3>
              <p>{category.subtitle}</p>
            </LinkButton>
          ))}
        </div>
      </section>
    </main>
  );
}

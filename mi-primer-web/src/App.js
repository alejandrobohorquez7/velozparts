import React, { useState, useEffect } from 'react';
import './App.css';

// Datos simulados
const brands = [
  { id: 1, name: 'Toyota', models: ['Corolla', 'Camry', 'Prado', 'Hilux'] },
  { id: 2, name: 'Chevrolet', models: ['Spark', 'Cruze', 'Captiva', 'Tahoe'] },
  { id: 3, name: 'Nissan', models: ['Sentra', 'Altima', 'X-Trail', 'Frontier'] },
  { id: 4, name: 'Hyundai', models: ['Accent', 'Elantra', 'Tucson', 'Santa Fe'] },
  { id: 5, name: 'Mazda', models: ['Mazda 2', 'Mazda 3', 'CX-3', 'CX-5'] },
  { id: 6, name: 'Ford', models: ['Fiesta', 'Focus', 'Escape', 'Explorer'] },
  { id: 7, name: 'Renault', models: ['Logan', 'Sandero', 'Duster', 'Koleos'] },
  { id: 8, name: 'KIA', models: ['Picanto', 'Rio', 'Sportage', 'Sorento'] },
  
];

const categories = [
  'Motor', 'Transmisión', 'Frenos', 'Suspensión', 
  'Eléctrico', 'Carrocería', 'Interior', 'Filtros'
];

const products = [
  {
    id: 1,
    name: 'Pastillas de Freno Delanteras',
    brand: 'Toyota',
    model: 'Corolla',
    category: 'Frenos',
    price: 85000,
    description: 'Pastillas de freno delanteras originales para Toyota Corolla 2015-2020. Disponible en Chapinero, Bogotá.',
    compatibility: '2015-2020',
    inStock: true,
    image: 'https://www.matsumotoparts.com/web/image/product.template/5933/image_1024?unique=a0318c8',
    storeName: 'Repuestos Toyota Chapinero',
    location: 'Chapinero, Bogotá'
  },
  {
    id: 2,
    name: 'Filtro de Aceite',
    brand: 'Chevrolet',
    model: 'Spark',
    category: 'Filtros',
    price: 25000,
    description: 'Filtro de aceite de alta calidad para motor 1.4L. Disponible en Kennedy, Bogotá.',
    compatibility: '2010-2021',
    inStock: true,
    image: 'https://www.pgfilters.com/wp-content/uploads/2023/02/What-is-the-Oil-Filters-Primary-Job_-1000x675-1.jpg',
    storeName: 'AutoFiltros Kennedy',
    location: 'Kennedy, Bogotá'
  },
  {
    id: 3,
    name: 'Amortiguador Trasero',
    brand: 'Nissan',
    model: 'Sentra',
    category: 'Suspensión',
    price: 180000,
    description: 'Amortiguador trasero hidráulico marca Original. Disponible en Usaquén, Bogotá.',
    compatibility: '2013-2019',
    inStock: false,
    image: 'https://autopartesdelmeta.com.co/wp-content/uploads/2021/05/AMORTIGUADOR-TRASERO-FORD-FIESTA-MAZDA-2.jpg',
    storeName: 'Suspensiones Norte Usaquén',
    location: 'Usaquén, Bogotá'
  },
  {
    id: 4,
    name: 'Batería 12V 60Ah',
    brand: 'Hyundai',
    model: 'Accent',
    category: 'Eléctrico',
    price: 320000,
    description: 'Batería libre de mantenimiento 12V 60Ah. Disponible en Bosa, Bogotá.',
    compatibility: '2012-2018',
    inStock: true,
    image: 'https://solobaterias.com.co/wp-content/uploads/2023/05/bateria-para-carro-34-mac-950-solo-baterias-medellin.jpg',
    storeName: 'Baterías Eléctricas Bosa',
    location: 'Bosa, Bogotá'
  },
  {
    id: 5,
    name: 'Disco de Freno',
    brand: 'Mazda',
    model: 'Mazda 3',
    category: 'Frenos',
    price: 120000,
    description: 'Disco de freno ventilado delantero. Disponible en Teusaquillo, Bogotá.',
    compatibility: '2014-2019',
    inStock: true,
    image: 'https://iasociadas.vteximg.com.br/arquivos/ids/177834-450-450/C24Y-33-25XE--_2.jpg?v=638799765552370000',
    storeName: 'Frenos Mazda Teusaquillo',
    location: 'Teusaquillo, Bogotá'
  },
  {
    id: 6,
    name: 'Bomba de Agua',
    brand: 'Ford',
    model: 'Fiesta',
    category: 'Motor',
    price: 95000,
    description: 'Bomba de agua con empaque incluido. Disponible en Fontibón, Bogotá.',
    compatibility: '2011-2017',
    inStock: true,
    image: 'https://www.idolz.com/wp-content/uploads/2021/04/water-pump-dolz.jpg',
    storeName: 'Motores Ford Fontibón',
    location: 'Fontibón, Bogotá'
  }
];

function App() {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [imageLoading, setImageLoading] = useState({}); // Estado para loading de imágenes por ID de producto
  const [imageErrors, setImageErrors] = useState({}); // Estado para errores de imágenes por ID

  // Inicializar loading de imágenes al cargar la app
  useEffect(() => {
    const initialLoading = {};
    products.forEach(product => {
      initialLoading[product.id] = true;
    });
    setImageLoading(initialLoading);
    setImageErrors({});
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedBrand) {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    if (selectedModel) {
      filtered = filtered.filter(product => product.model === selectedModel);
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedBrand, selectedModel, selectedCategory, searchTerm]);

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand.name);
    setSelectedModel('');
    setCurrentView('catalog');
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const resetFilters = () => {
    setSelectedBrand('');
    setSelectedModel('');
    setSelectedCategory('');
    setSearchTerm('');
    setCurrentView('home');
  };

  const handleImageLoad = (productId) => {
    setImageLoading(prev => ({ ...prev, [productId]: false }));
    setImageErrors(prev => ({ ...prev, [productId]: false }));
  };

  const handleImageError = (productId) => {
    setImageLoading(prev => ({ ...prev, [productId]: false }));
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  return (
    <div className="App">
      <header className="header">
        <nav className="nav">
          <div className="logo" onClick={resetFilters}>
            VelozParts
          </div>
          <ul className="nav-links">
            <li><a href="#" className="nav-link" onClick={resetFilters}>Inicio</a></li>
            <li><a href="#" className="nav-link" onClick={() => setCurrentView('catalog')}>Catálogo</a></li>
            <li><a href="#" className="nav-link">Marcas</a></li>
            <li><a href="#" className="nav-link">Contacto</a></li>
          </ul>
        </nav>
      </header>

      <main className="main">
        {currentView === 'home' && (
          <>
            <section className="hero">
              <div className="hero-content">
                <h1>Repuestos Automotrices</h1>
                <p>Encuentra los repuestos exactos para tu vehículo con precios transparentes y entregas confiables</p>
              </div>
            </section>

            <section className="section">
              <div className="container">
                <h2 className="section-title">Buscar por Marca</h2>
                <div className="brands-grid">
                  {brands.map(brand => (
                    <div 
                      key={brand.id} 
                      className="brand-card"
                      onClick={() => handleBrandSelect(brand)}
                    >
                      <h3>{brand.name}</h3>
                      <p>{brand.models.length} Modelos disponibles</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {currentView === 'catalog' && (
          <section className="section catalog-section">
            <div className="container">
              <h2 className="section-title">Catálogo de Repuestos</h2>
              
              <input
                type="text"
                placeholder="Buscar repuestos..."
                className="search-bar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div className="filters">
                <select 
                  className="filter-select"
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value);
                    setSelectedModel('');
                  }}
                >
                  <option value="">Todas las marcas</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.name}>
                      {brand.name}
                    </option>
                  ))}
                </select>

                <select 
                  className="filter-select"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedBrand}
                >
                  <option value="">Todos los modelos</option>
                  {selectedBrand && brands.find(b => b.name === selectedBrand)?.models.map(model => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>

                <select 
                  className="filter-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Todas las categorías</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="products-grid">
                {filteredProducts.map(product => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      {imageLoading[product.id] && <div className="image-loader">Cargando...</div>}
                      {imageErrors[product.id] && <div className="image-placeholder">Sin imagen disponible</div>}
                      <img 
                        src={product.image} 
                        alt={product.name}
                        loading="lazy"
                        onLoad={() => handleImageLoad(product.id)}
                        onError={() => handleImageError(product.id)}
                        className={`product-img ${!imageLoading[product.id] && !imageErrors[product.id] ? 'loaded' : ''}`}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'contain' 
                        }} 
                      />
                    </div>
                    <div className="product-info">
                      <h3 className="product-title">{product.name}</h3>
                      <div className="product-details">
                        {product.brand} {product.model} • {product.compatibility}
                      </div>
                      <div className="product-store">
                        <strong>{product.storeName}</strong> - {product.location}
                      </div>
                      <div className="product-price">
                        {formatPrice(product.price)}
                      </div>
                      <button 
                        className={`btn ${!product.inStock ? 'btn-outline' : ''}`}
                        onClick={() => handleProductClick(product)}
                        disabled={!product.inStock}
                      >
                        {product.inStock ? 'Ver Detalles' : 'Sin Stock'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="no-products">
                  <p>No se encontraron productos con los filtros seleccionados.</p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {showModal && selectedProduct && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowModal(false)}>
              ×
            </button>
            <h2>{selectedProduct.name}</h2>
            <div className="product-image modal-image">
              {imageLoading[selectedProduct.id] && <div className="image-loader">Cargando...</div>}
              {imageErrors[selectedProduct.id] && <div className="image-placeholder">Sin imagen disponible</div>}
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name}
                loading="lazy"
                onLoad={() => handleImageLoad(selectedProduct.id)}
                onError={() => handleImageError(selectedProduct.id)}
                className={`modal-img ${!imageLoading[selectedProduct.id] && !imageErrors[selectedProduct.id] ? 'loaded' : ''}`}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain' 
                }} 
              />
            </div>
            <p><strong>Marca:</strong> {selectedProduct.brand}</p>
            <p><strong>Modelo:</strong> {selectedProduct.model}</p>
            <p><strong>Categoría:</strong> {selectedProduct.category}</p>
            <p><strong>Compatibilidad:</strong> {selectedProduct.compatibility}</p>
            <p className="product-store">
              <strong>{selectedProduct.storeName}</strong> - {selectedProduct.location}
            </p>
            <p><strong>Precio:</strong> {formatPrice(selectedProduct.price)}</p>
            <p className="product-description">{selectedProduct.description}</p>
            
            {selectedProduct.inStock ? (
              <div className="modal-buttons">
                <button className="btn">
                  Agregar al Carrito
                </button>
                <button className="btn btn-outline">
                  Consultar
                </button>
              </div>
            ) : (
              <button className="btn btn-outline btn-full">
                Notificar Cuando Esté Disponible
              </button>
            )}
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>VelozParts</h3>
              <p>Tu plataforma confiable para repuestos automotrices en Colombia. Precios transparentes, calidad garantizada.</p>
            </div>
            <div className="footer-section">
              <h3>Servicios</h3>
              <p><a href="#">Catálogo por Marcas</a></p>
              <p><a href="#">Búsqueda Inteligente</a></p>
              <p><a href="#">Envío a Domicilio</a></p>
              <p><a href="#">Garantía Extendida</a></p>
            </div>
            <div className="footer-section">
              <h3>Contacto</h3>
              <p>Bogotá, Colombia</p>
              <p>info@velozparts.co</p>
              <p>(+57) 123-456-7910</p>
            </div>
          </div>
          <p>&copy; 2025 VelozParts. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
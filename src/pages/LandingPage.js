import React from 'react';
import { Layers, Users, ShoppingCart, Package, TrendingUp, CreditCard, Truck, Shield, Store } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Modernize Your Building Supply Store</h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl">
            A complete Point of Sales system tailored for building supply stores.
            Streamline operations, manage inventory, and boost sales with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register" className="bg-white text-blue-800 hover:bg-blue-100 font-bold px-6 py-3 rounded-lg shadow-lg transition duration-300 text-center">
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">Powerful Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <ShoppingCart className="text-blue-700" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-900">Sales Transactions</h3>
              <p className="text-gray-700">
                Efficient checkout process with quick product lookup and multiple payment options. Create invoices and manage sales efficiently.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Package className="text-blue-700" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-900">Inventory Management</h3>
              <p className="text-gray-700">
                Keep track of all products with real-time stock updates, low stock alerts, and detailed product information.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users className="text-blue-700" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-900">Customer Management</h3>
              <p className="text-gray-700">
                Build stronger relationships by tracking customer purchases, preferences, and contact information.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Truck className="text-blue-700" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-900">Supplier Management</h3>
              <p className="text-gray-700">
                Manage your suppliers, track purchase orders, and organize supplier information for better procurement.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <CreditCard className="text-blue-700" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-900">Payment Processing</h3>
              <p className="text-gray-700">
                Support for multiple payment methods including cash, credit cards, and installment payments.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <TrendingUp className="text-blue-700" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-900">Reports & Analytics</h3>
              <p className="text-gray-700">
                Gain valuable insights with customizable reports on sales performance, inventory levels, and business trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 bg-blue-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">Why Choose Building Store POS</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-8">
                <div className="flex items-start mb-3">
                  <div className="bg-blue-600 rounded-full p-1 mr-3 mt-1">
                    <Shield size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Streamlined Operations</h3>
                    <p className="text-gray-700">Save time and reduce errors with our intuitive system designed specifically for building supply stores.</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="flex items-start mb-3">
                  <div className="bg-blue-600 rounded-full p-1 mr-3 mt-1">
                    <Shield size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Improved Inventory Control</h3>
                    <p className="text-gray-700">Never run out of popular items or overstock slow-moving products again.</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="flex items-start mb-3">
                  <div className="bg-blue-600 rounded-full p-1 mr-3 mt-1">
                    <Shield size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Enhanced Customer Service</h3>
                    <p className="text-gray-700">Provide faster checkouts and personalized service with customer history at your fingertips.</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="flex items-start mb-3">
                  <div className="bg-blue-600 rounded-full p-1 mr-3 mt-1">
                    <Shield size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Data-Driven Decisions</h3>
                    <p className="text-gray-700">Make informed business choices based on real-time data and comprehensive reports.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-800 rounded-lg p-8 shadow-xl text-white">
              <div className="flex items-center justify-center mb-6">
                <Store size={64} className="text-blue-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">Building Store POS</h3>
              <p className="mb-6 text-center">Join hundreds of building supply stores already using our system to streamline operations and boost sales.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

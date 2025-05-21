import React from 'react';
import { Layers } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-blue-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Layers size={24} className="text-blue-300" />
              <span className="text-xl font-bold">Building Store</span>
            </div>
            <p className="text-blue-300">
              Complete POS Solution for Building Supply Stores
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-blue-300">Email: info@buildingstore.com</li>
              <li className="text-blue-300">Phone: (123) 456-7890</li>
              <li className="text-blue-300">Address: AdvProg, Fasilkom</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-400">
          <p>&copy; {new Date().getFullYear()} Building Store. All rights reserved.</p>
          <p className="text-sm mt-2">Developed by Team B01</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
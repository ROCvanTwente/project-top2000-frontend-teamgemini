import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Bedankt voor je bericht! We nemen zo spoedig mogelijk contact met je op.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-12 bg-black"></div>
          <h1>Contact</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-white">
                  <Mail size={24} />
                </div>
                <div>
                  <h3>Email</h3>
                  <p className="text-gray-600">info@top2000.nl</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-white">
                  <Phone size={24} />
                </div>
                <div>
                  <h3>Telefoon</h3>
                  <p className="text-gray-600">035 - 677 99 99</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center text-white">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3>Adres</h3>
                  <p className="text-gray-600">
                    NPO Radio 2<br />
                    Media Park<br />
                    1217 WE Hilversum
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black rounded-lg p-6 text-white">
              <h3 className="text-white mb-3">Openingstijden</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Maandag - Vrijdag:</span>
                  <span>09:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Weekend:</span>
                  <span>Gesloten</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="mb-6">Stuur ons een bericht</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block mb-2">
                    Naam *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-black"
                    placeholder="Je naam"
                  />
                </div>

                <div>
                  <label className="block mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-black"
                    placeholder="je@email.nl"
                  />
                </div>

                <div>
                  <label className="block mb-2">
                    Onderwerp *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-black"
                    placeholder="Onderwerp van je bericht"
                  />
                </div>

                <div>
                  <label className="block mb-2">
                    Bericht *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-black resize-none"
                    placeholder="Je bericht..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Verstuur bericht
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useRef } from 'react';
import { Camera, Upload, Download, Share2, Sparkles, Dna, Instagram } from 'lucide-react';

interface PhotoSlot {
  id: string;
  label: string;
  description: string;
  file: File | null;
  preview: string | null;
}

function App() {
  const [photos, setPhotos] = useState<PhotoSlot[]>([
    { id: 'nose', label: 'Foto do Focinho', description: 'Close-up do nariz', file: null, preview: null },
    { id: 'front', label: 'Foto Frontal', description: 'Rosto de frente', file: null, preview: null },
    { id: 'angle', label: 'Foto em Ângulo', description: 'Rosto de lado', file: null, preview: null }
  ]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleFileSelect = (id: string, file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        setPhotos(prev => prev.map(photo => 
          photo.id === id ? { ...photo, file, preview } : photo
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTransform = async () => {
    const allPhotosUploaded = photos.every(photo => photo.file);
    if (!allPhotosUploaded || !termsAccepted) return;

    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setResult('https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2');
      setIsProcessing(false);
    }, 4000);
  };

  const handleDownload = () => {
    // Simulate download
    const link = document.createElement('a');
    link.href = result || '';
    link.download = 'meu-pet-humano.jpg';
    link.click();
  };

  const handleShare = (platform: string) => {
    const text = encodeURIComponent('Olha como meu pet ficaria como humano! 🐕➡️👤');
    const url = encodeURIComponent(window.location.href);
    
    if (platform === 'instagram') {
      alert('Baixe a imagem e compartilhe no Instagram Stories!');
    } else if (platform === 'tiktok') {
      window.open(`https://www.tiktok.com/share?text=${text}&url=${url}`, '_blank');
    }
  };

  const allPhotosUploaded = photos.every(photo => photo.file);
  const canTransform = allPhotosUploaded && termsAccepted;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-cyan-400 mr-3 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Como seu pet seria se fosse humano?
            </h1>
            <Sparkles className="w-8 h-8 text-cyan-400 ml-3 animate-pulse" />
          </div>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Envie 3 fotos e veja a mágica acontecer.
          </p>
          <div className="mt-8 flex items-center justify-center space-x-2">
            <Dna className="w-6 h-6 text-green-400 animate-spin" />
            <span className="text-green-400 font-semibold">Tecnologia AI Avançada</span>
          </div>
        </header>

        {!result ? (
          <>
            {/* Upload Section */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-cyan-300">
                Carregue as Fotos do Seu Pet
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20"
                  >
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-white mb-1">{photo.label}</h3>
                      <p className="text-sm text-gray-400">{photo.description}</p>
                    </div>

                    <div 
                      className="relative border-2 border-dashed border-gray-600 rounded-xl p-8 transition-all duration-300 group-hover:border-cyan-400/50 cursor-pointer"
                      onClick={() => fileInputRefs.current[photo.id]?.click()}
                    >
                      {photo.preview ? (
                        <div className="relative">
                          <img 
                            src={photo.preview} 
                            alt={`Preview ${photo.label}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
                          <Camera className="absolute bottom-2 right-2 w-6 h-6 text-white" />
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4 group-hover:text-cyan-400 transition-colors" />
                          <p className="text-gray-400 group-hover:text-cyan-400 transition-colors">
                            Clique para enviar
                          </p>
                        </div>
                      )}
                    </div>

                    <input
                      ref={el => fileInputRefs.current[photo.id] = el}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(photo.id, file);
                      }}
                    />

                    {/* Progress indicator */}
                    <div className="mt-4 flex items-center justify-center">
                      <div className={`w-3 h-3 rounded-full ${photo.file ? 'bg-green-400' : 'bg-gray-600'} transition-colors`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Terms and Privacy Checkbox */}
            <section className="mb-12">
              <div className="max-w-2xl mx-auto">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-lg shadow-cyan-500/10">
                  <label className="flex items-start space-x-4 cursor-pointer group">
                    <div className="relative flex-shrink-0 mt-1">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`
                        w-5 h-5 rounded border-2 transition-all duration-300 flex items-center justify-center
                        ${termsAccepted 
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-600 border-cyan-400 shadow-lg shadow-cyan-400/30' 
                          : 'border-gray-500 group-hover:border-cyan-400/50'
                        }
                      `}>
                        {termsAccepted && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                      Ao continuar, você concorda com os nossos{' '}
                      <a 
                        href="#" 
                        className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Termos de Uso
                      </a>
                      {' '}e{' '}
                      <a 
                        href="#" 
                        className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Política de Privacidade
                      </a>
                      .
                    </div>
                  </label>
                </div>
              </div>
            </section>

            {/* Transform Button */}
            <div className="text-center mb-16">
              <button
                onClick={handleTransform}
                disabled={!canTransform || isProcessing}
                className={`
                  group relative inline-flex items-center justify-center px-12 py-6 text-xl font-bold rounded-2xl
                  transition-all duration-300 transform hover:scale-105
                  ${canTransform && !isProcessing
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-lg shadow-cyan-500/25 animate-pulse hover:animate-none'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {isProcessing ? (
                  <>
                    <Dna className="w-6 h-6 mr-3 animate-spin" />
                    Analisando DNA do seu pet...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 mr-3" />
                    Transformar em Humano 🧬
                  </>
                )}
                
                {canTransform && !isProcessing && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 opacity-75 blur-xl animate-pulse"></div>
                )}
              </button>

              {!allPhotosUploaded && (
                <p className="mt-4 text-gray-400">
                  Envie todas as 3 fotos para continuar
                </p>
              )}
              
              {allPhotosUploaded && !termsAccepted && (
                <p className="mt-4 text-gray-400">
                  Aceite os termos para continuar
                </p>
              )}
            </div>

            {/* Processing State */}
            {isProcessing && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md mx-4 text-center">
                  <div className="relative mb-6">
                    <Dna className="w-16 h-16 text-cyan-400 mx-auto animate-spin" />
                    <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-cyan-300">Processando...</h3>
                  <p className="text-gray-300 mb-6">Nossa IA está analisando o DNA do seu pet e criando a versão humana!</p>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full rounded-full animate-pulse w-3/4"></div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Result Section */
          <section className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              🎉 Transformação Completa!
            </h2>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
              <img 
                src={result} 
                alt="Pet transformado em humano"
                className="w-full max-w-md mx-auto rounded-xl shadow-2xl shadow-cyan-500/20"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <Download className="w-5 h-5 mr-2" />
                Baixar Imagem
              </button>
              
              <button
                onClick={() => handleShare('instagram')}
                className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <Instagram className="w-5 h-5 mr-2" />
                Instagram
              </button>
              
              <button
                onClick={() => handleShare('tiktok')}
                className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <Share2 className="w-5 h-5 mr-2" />
                TikTok
              </button>
            </div>

            <button
              onClick={() => {
                setResult(null);
                setPhotos(photos.map(photo => ({ ...photo, file: null, preview: null })));
                setTermsAccepted(false);
              }}
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors underline"
            >
              Transformar outro pet
            </button>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-20 pt-12 border-t border-white/10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Termos de Uso</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Política de Privacidade</a>
            </div>
            
            <p className="text-gray-500 text-sm">
              © 2024 Pet AI Transform.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
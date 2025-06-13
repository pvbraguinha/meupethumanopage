import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Download, Share2, Sparkles, Dna, Instagram, AlertCircle, Users } from 'lucide-react';

interface PhotoSlot {
  id: string;
  label: string;
  description: string;
  file: File | null;
  preview: string | null;
  required: boolean;
}

interface PetDetails {
  especie: 'cão' | 'gato' | '';
  breed: string;
  sex: 'macho' | 'fêmea' | '';
  age: number;
}

interface TransformResult {
  frontal_url?: string;
  focinho_url?: string;
  angulo_url?: string;
  prompt?: string;
  result_url?: string;
  message?: string;
}

function App() {
  const [photos, setPhotos] = useState<PhotoSlot[]>([
    { id: 'frontal', label: 'Foto Frontal', description: 'Rosto de frente (obrigatória)', file: null, preview: null, required: true },
    { id: 'focinho', label: 'Foto do Focinho', description: 'Close-up do nariz (opcional)', file: null, preview: null, required: false },
    { id: 'angulo', label: 'Foto em Ângulo', description: 'Rosto de lado (opcional)', file: null, preview: null, required: false }
  ]);
  
  const [showPetDetails, setShowPetDetails] = useState(false);
  const [petDetails, setPetDetails] = useState<PetDetails>({
    especie: '',
    breed: '',
    sex: '',
    age: 1
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<TransformResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [petCount, setPetCount] = useState<number>(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Buscar contador de pets transformados
  useEffect(() => {
    const fetchPetCount = async () => {
      try {
        const response = await fetch('https://smartdog-backend-vlm0.onrender.com/api/pet-human-count');
        if (response.ok) {
          const data = await response.json();
          setPetCount(data.count || 0);
        }
      } catch (error) {
        console.error('Erro ao buscar contador:', error);
      }
    };

    fetchPetCount();
  }, []);

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
      setError(null);
    }
  };

  const handleShowPetDetails = () => {
    const frontalPhoto = photos.find(p => p.id === 'frontal');
    if (!frontalPhoto?.file) {
      setError('A foto frontal é obrigatória para continuar.');
      return;
    }
    setShowPetDetails(true);
    setError(null);
  };

  const handleTransform = async () => {
    if (!petDetails.especie || !petDetails.sex || !petDetails.breed.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!termsAccepted) {
      setError('Você deve aceitar os termos para continuar.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      
      // Adicionar imagens
      photos.forEach(photo => {
        if (photo.file) {
          formData.append(photo.id, photo.file);
        }
      });

      // Adicionar dados do pet
      formData.append('especie', petDetails.especie);
      formData.append('breed', petDetails.breed);
      formData.append('sex', petDetails.sex);
      formData.append('age', petDetails.age.toString());
      formData.append('session', `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

      const response = await fetch('https://smartdog-backend-vlm0.onrender.com/api/upload-pet-images', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        // Atualizar contador
        setPetCount(prev => prev + 1);
      } else {
        setError(data.message || 'Erro ao processar a transformação. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result?.result_url) {
      const link = document.createElement('a');
      link.href = result.result_url;
      link.download = 'meu-pet-humano.jpg';
      link.target = '_blank';
      link.click();
    }
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

  const resetApp = () => {
    setResult(null);
    setPhotos(photos.map(photo => ({ ...photo, file: null, preview: null })));
    setPetDetails({ especie: '', breed: '', sex: '', age: 1 });
    setShowPetDetails(false);
    setTermsAccepted(false);
    setError(null);
  };

  const hasRequiredPhotos = photos.find(p => p.id === 'frontal')?.file !== null;

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
            Envie fotos do seu pet e veja a mágica acontecer.
          </p>
          <div className="mt-8 flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <Dna className="w-6 h-6 text-green-400 animate-spin" />
              <span className="text-green-400 font-semibold">Tecnologia AI Avançada</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-6 h-6 text-cyan-400" />
              <span className="text-cyan-400 font-semibold">{petCount.toLocaleString()} pets já transformados!</span>
            </div>
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}

        {!result ? (
          <>
            {/* Upload Section */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-cyan-300">
                Carregue as Fotos do Seu Pet
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20"
                  >
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-white mb-1 flex items-center justify-center">
                        {photo.label}
                        {photo.required && <span className="text-red-400 ml-1">*</span>}
                      </h3>
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
                          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4 group-hover:text-cyan-400 transition-colors" />
                          <p className="text-gray-400 group-hover:text-cyan-400 transition-colors text-sm">
                            Toque para capturar ou escolher foto
                          </p>
                        </div>
                      )}
                    </div>

                    <input
                      ref={el => fileInputRefs.current[photo.id] = el}
                      type="file"
                      accept="image/*"
                      capture="environment"
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

            {/* Transform Button */}
            {!showPetDetails && (
              <div className="text-center mb-16">
                <button
                  onClick={handleShowPetDetails}
                  disabled={!hasRequiredPhotos}
                  className={`
                    group relative inline-flex items-center justify-center px-16 py-8 text-2xl font-black rounded-3xl
                    transition-all duration-500 transform hover:scale-110 active:scale-95
                    ${hasRequiredPhotos
                      ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:from-cyan-300 hover:via-blue-400 hover:to-purple-500 text-white shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-400/60 animate-pulse hover:animate-none'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                  <div className="relative flex items-center">
                    <Sparkles className="w-8 h-8 mr-4 animate-spin group-hover:animate-pulse" />
                    <span className="bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                      Transformar em Humano
                    </span>
                    <span className="ml-3 text-3xl">🧬</span>
                  </div>
                  
                  {hasRequiredPhotos && (
                    <>
                      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-30 blur-lg animate-pulse"></div>
                      <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-20 blur-2xl animate-pulse delay-75"></div>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Pet Details Form */}
            {showPetDetails && (
              <section className="mb-12">
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-cyan-300">
                    Detalhes do Seu Pet
                  </h2>
                  
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-6">
                    {/* Espécie */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Espécie <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={petDetails.especie}
                        onChange={(e) => setPetDetails(prev => ({ ...prev, especie: e.target.value as 'cão' | 'gato' }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-colors"
                      >
                        <option value="">Selecione a espécie</option>
                        <option value="cão">Cão</option>
                        <option value="gato">Gato</option>
                      </select>
                    </div>

                    {/* Raça */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Raça <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={petDetails.breed}
                        onChange={(e) => setPetDetails(prev => ({ ...prev, breed: e.target.value }))}
                        placeholder="Ex: Labrador, Vira-lata, Persa..."
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Sexo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Sexo <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={petDetails.sex}
                        onChange={(e) => setPetDetails(prev => ({ ...prev, sex: e.target.value as 'macho' | 'fêmea' }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-colors"
                      >
                        <option value="">Selecione o sexo</option>
                        <option value="macho">Macho</option>
                        <option value="fêmea">Fêmea</option>
                      </select>
                    </div>

                    {/* Idade */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Idade (anos) <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={petDetails.age}
                        onChange={(e) => setPetDetails(prev => ({ ...prev, age: parseInt(e.target.value) || 1 }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Terms and Privacy Checkbox */}
                    <div className="pt-4">
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

                    {/* Submit Button */}
                    <div className="pt-6">
                      <button
                        onClick={handleTransform}
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <>
                            <Dna className="w-6 h-6 mr-3 animate-spin inline" />
                            Transformando...
                          </>
                        ) : (
                          'Finalizar e Transformar em Humano'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Processing State */}
            {isProcessing && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md mx-4 text-center">
                  <div className="relative mb-6">
                    <Dna className="w-16 h-16 text-cyan-400 mx-auto animate-spin" />
                    <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-cyan-300">Transformando seu pet...</h3>
                  <p className="text-gray-300 mb-6">Nossa IA está analisando as características do seu pet e criando a versão humana!</p>
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
              {result.result_url ? (
                <img 
                  src={result.result_url} 
                  alt="Pet transformado em humano"
                  className="w-full max-w-md mx-auto rounded-xl shadow-2xl shadow-cyan-500/20"
                />
              ) : (
                <div className="w-full max-w-md mx-auto h-64 bg-gray-700 rounded-xl flex items-center justify-center">
                  <p className="text-gray-400">Imagem não disponível</p>
                </div>
              )}
              
              {result.prompt && (
                <div className="mt-6 p-4 bg-white/5 rounded-xl">
                  <h4 className="text-sm font-semibold text-cyan-300 mb-2">Prompt usado:</h4>
                  <p className="text-sm text-gray-300">{result.prompt}</p>
                </div>
              )}
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
              onClick={resetApp}
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
              © 2024 Pet AI Transform. {petCount.toLocaleString()} pets já transformados!
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
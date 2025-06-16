import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, AlertCircle, Heart, User } from 'lucide-react';

interface PhotoSlot {
  id: string;
  label: string;
  description: string;
  file: File | null;
  preview: string | null;
  required: boolean;
}

interface PetDetails {
  name: string;
  especie: 'cachorro' | 'gato' | '';
  breed: string;
  sex: 'macho' | 'fêmea' | '';
  age: string;
}

interface UploadResult {
  success?: boolean;
  message?: string;
  error?: string;
}

function App() {
  const [photos, setPhotos] = useState<PhotoSlot[]>([
    { id: 'frontal', label: 'Foto Frontal', description: 'Rosto de frente', file: null, preview: null, required: true },
    { id: 'focinho', label: 'Foto do Focinho', description: 'Close-up do nariz', file: null, preview: null, required: false },
    { id: 'angulo', label: 'Foto em Ângulo', description: 'Rosto de lado', file: null, preview: null, required: false }
  ]);
  
  const [showPetDetails, setShowPetDetails] = useState(false);
  const [petDetails, setPetDetails] = useState<PetDetails>({
    name: '',
    especie: '',
    breed: '',
    sex: '',
    age: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [petCount, setPetCount] = useState<number>(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Buscar contador de pets que contribuíram
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
        // Usar localStorage como fallback
        const savedCount = localStorage.getItem('petContributionCount');
        setPetCount(savedCount ? parseInt(savedCount) : 0);
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

  // Gerar UUID único para sessão
  const generateSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  // Função para enviar formulário - APENAS UPLOAD PARA S3
  const handleSubmitPetForm = async () => {
    // Validação dos campos obrigatórios
    if (!petDetails.name.trim()) {
      setError('O nome do pet é obrigatório.');
      return;
    }
    
    if (!petDetails.especie || !petDetails.sex || !petDetails.breed.trim() || !petDetails.age.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!termsAccepted) {
      setError('Você deve aceitar os termos para continuar.');
      return;
    }

    const frontalPhoto = photos.find(p => p.id === 'frontal');
    if (!frontalPhoto?.file) {
      setError('A foto frontal é obrigatória para continuar.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      
      // Adicionar imagens (frontal obrigatória, outras opcionais)
      formData.append('frontal', frontalPhoto.file);
      
      const focinhoPhoto = photos.find(p => p.id === 'focinho');
      if (focinhoPhoto?.file) {
        formData.append('focinho', focinhoPhoto.file);
      }
      
      const anguloPhoto = photos.find(p => p.id === 'angulo');
      if (anguloPhoto?.file) {
        formData.append('angulo', anguloPhoto.file);
      }
      
      // Adicionar dados do pet
      formData.append('name', petDetails.name.trim());
      formData.append('session', generateSessionId());
      formData.append('breed', petDetails.breed.trim());
      formData.append('sex', petDetails.sex === 'fêmea' ? 'female' : 'male');
      formData.append('age', petDetails.age.trim());
      formData.append('especie', petDetails.especie);

      console.log('=== ENVIANDO PARA UPLOAD S3 ===');
      console.log('Endpoint:', 'https://smartdog-backend-vlm0.onrender.com/upload-pet-images');
      console.log('Dados enviados:', {
        name: petDetails.name.trim(),
        especie: petDetails.especie,
        breed: petDetails.breed.trim(),
        sex: petDetails.sex,
        age: petDetails.age.trim(),
        frontal: frontalPhoto.file.name,
        focinho: focinhoPhoto?.file?.name || 'não enviado',
        angulo: anguloPhoto?.file?.name || 'não enviado'
      });

      const response = await fetch('https://smartdog-backend-vlm0.onrender.com/upload-pet-images', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('=== RESPOSTA UPLOAD S3 ===');
      console.log('Resposta completa:', data);

      if (response.ok && data.success) {
        setResult({ 
          success: true, 
          message: petDetails.name.trim() 
            ? `${petDetails.name} acabou de contribuir para ajudar uma família!`
            : 'Seu pet acabou de contribuir para ajudar uma família!'
        });
        
        // Atualizar contador
        const newCount = petCount + 1;
        setPetCount(newCount);
        localStorage.setItem('petContributionCount', newCount.toString());
      } else {
        setError(data.error || data.message || 'Erro ao enviar as fotos. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro na requisição de upload:', error);
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetApp = () => {
    setResult(null);
    setPhotos(photos.map(photo => ({ ...photo, file: null, preview: null })));
    setPetDetails({ name: '', especie: '', breed: '', sex: '', age: '' });
    setShowPetDetails(false);
    setTermsAccepted(false);
    setError(null);
  };

  const hasRequiredPhotos = photos.find(p => p.id === 'frontal')?.file !== null;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Subtle animated background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 text-cyan-400 mr-3 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold neon-blue neon-text-glow">
              O seu pet pode salvar um animal perdido
            </h1>
            <Heart className="w-8 h-8 text-cyan-400 ml-3 animate-pulse" />
          </div>
          <p className="text-xl md:text-2xl text-white max-w-4xl mx-auto leading-relaxed mb-8">
            Crie esperança com uma simples foto.
          </p>
          <div className="mt-8 flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2">
              {/* Ícones fofos de cachorro e gato */}
              <div className="flex items-center space-x-1">
                <span className="text-2xl animate-bounce">🐕</span>
                <Heart className="w-4 h-4 text-pink-400 animate-pulse" />
                <span className="text-2xl animate-bounce delay-150">😺</span>
              </div>
              <span className="text-cyan-400 font-semibold">{petCount.toLocaleString()} pets já contribuíram!</span>
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
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 neon-blue">
                Carregue as Fotos do Seu Pet
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group relative glass-card rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-300"
                  >
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-white mb-1 flex items-center justify-center">
                        {photo.label}
                      </h3>
                      <p className="text-sm text-gray-400">{photo.description}</p>
                    </div>

                    <div 
                      className="upload-area relative rounded-xl p-8 transition-all duration-300 cursor-pointer"
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

            {/* Help Button - SEM SHIMMER OFUSCANTE! */}
            {!showPetDetails && (
              <div className="text-center mb-16">
                <button
                  onClick={handleShowPetDetails}
                  disabled={!hasRequiredPhotos}
                  className="perfect-neon-button group relative inline-flex items-center justify-center px-16 py-8 text-2xl font-black rounded-full transition-all duration-500 transform hover:scale-110 active:scale-95 overflow-hidden shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="relative flex items-center z-10">
                    <Heart className="w-10 h-10 mr-4 animate-pulse text-white drop-shadow-lg" />
                    <span className="font-black tracking-wide text-white drop-shadow-lg">
                      🐾 Ajudar uma Família
                    </span>
                  </div>
                </button>
              </div>
            )}

            {/* Pet Details Form */}
            {showPetDetails && (
              <section className="mb-12">
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 neon-blue">
                    Detalhes do Seu Pet
                  </h2>
                  
                  <div className="glass-card rounded-2xl p-8 space-y-6">
                    {/* Nome do Pet */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nome do Pet <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={petDetails.name}
                        onChange={(e) => setPetDetails(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Luna, Thor, Nina..."
                        className="form-input w-full px-4 py-3 rounded-xl focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Espécie */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Espécie <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={petDetails.especie}
                        onChange={(e) => {
                          const newEspecie = e.target.value as 'cachorro' | 'gato';
                          setPetDetails(prev => ({ 
                            ...prev, 
                            especie: newEspecie,
                            breed: '' // Reset breed when species changes
                          }));
                        }}
                        className="form-select w-full px-4 py-3 rounded-xl focus:outline-none transition-colors"
                      >
                        <option value="">Selecione a espécie</option>
                        <option value="cachorro">Cachorro</option>
                        <option value="gato">Gato</option>
                      </select>
                    </div>

                    {/* Raça - Campo de texto livre */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Raça <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={petDetails.breed}
                        onChange={(e) => setPetDetails(prev => ({ ...prev, breed: e.target.value }))}
                        placeholder="Ex: Labrador, SRD, Persa, etc..."
                        className="form-input w-full px-4 py-3 rounded-xl focus:outline-none transition-colors"
                      />
                      <p className="text-xs text-gray-400 mt-2">
                        💡 Digite a raça do seu pet ou "SRD" se for sem raça definida
                      </p>
                    </div>

                    {/* Sexo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Sexo <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={petDetails.sex}
                        onChange={(e) => setPetDetails(prev => ({ ...prev, sex: e.target.value as 'macho' | 'fêmea' }))}
                        className="form-select w-full px-4 py-3 rounded-xl focus:outline-none transition-colors"
                      >
                        <option value="">Selecione o sexo</option>
                        <option value="macho">Macho</option>
                        <option value="fêmea">Fêmea</option>
                      </select>
                    </div>

                    {/* Idade - CAMPO FLEXÍVEL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Idade <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={petDetails.age}
                        onChange={(e) => setPetDetails(prev => ({ ...prev, age: e.target.value }))}
                        placeholder="Ex: 3 anos, 6 meses, 45 dias..."
                        className="form-input w-full px-4 py-3 rounded-xl focus:outline-none transition-colors"
                      />
                      <p className="text-xs text-gray-400 mt-2">
                        💡 Você pode informar em dias, meses ou anos (ex: "2 anos", "8 meses", "30 dias")
                      </p>
                    </div>

                    {/* Terms and Privacy Checkbox */}
                    <div className="pt-4">
                      <label className="flex items-start space-x-4 cursor-pointer group">
                        <div className="custom-checkbox flex-shrink-0 mt-1">
                          <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                          />
                          <span className="checkmark"></span>
                        </div>
                        <div className="text-sm text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                          Ao continuar, você concorda com os nossos{' '}
                          <a 
                            href="https://smartdog-backend-vlm0.onrender.com/termos-de-uso.html" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Termos de Uso
                          </a>
                          {' '}e{' '}
                          <a 
                            href="https://smartdog-backend-vlm0.onrender.com/politica-de-privacidade.html" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Política de Privacidade
                          </a>
                          .
                        </div>
                      </label>
                    </div>

                    {/* Submit Button - SEM SHIMMER OFUSCANTE! */}
                    <div className="pt-6">
                      <button
                        onClick={handleSubmitPetForm}
                        disabled={isProcessing}
                        className="perfect-neon-button w-full text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <>
                            <Heart className="w-6 h-6 mr-3 animate-pulse inline" />
                            Enviando contribuição...
                          </>
                        ) : (
                          'Finalizar'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Processing State */}
            {isProcessing && (
              <div className="loading-overlay fixed inset-0 flex items-center justify-center z-50">
                <div className="glass-card rounded-2xl p-8 max-w-md mx-4 text-center">
                  <div className="relative mb-6">
                    <Heart className="w-16 h-16 text-cyan-400 mx-auto animate-pulse" />
                    <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 neon-blue">Enviando contribuição</h3>
                  <p className="text-gray-300 mb-6">Seu pet está ajudando uma família!</p>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full animate-pulse w-3/4"></div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Result Section */
          <section className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 neon-blue">
              💚 Obrigado pela contribuição!
            </h2>
            
            <div className="success-message rounded-2xl p-8 mb-8">
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-r from-green-400 to-cyan-400 rounded-full flex items-center justify-center">
                  <Heart className="w-12 h-12 text-white animate-pulse" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-green-400">
                🐾 {result.message}
              </h3>
              
              <p className="text-lg text-gray-300 mb-6">
                As fotos enviadas serão usadas para treinar uma inteligência artificial capaz de identificar animais perdidos. 
                Nenhuma imagem será usada sem seu consentimento.
              </p>
              
              <div className="flex items-center justify-center space-x-2 mb-6">
                <span className="text-2xl animate-bounce">🐕</span>
                <Heart className="w-6 h-6 text-pink-400 animate-pulse" />
                <span className="text-2xl animate-bounce delay-150">😺</span>
                <span className="text-cyan-400 font-semibold text-lg ml-4">
                  {petCount.toLocaleString()} pets já contribuíram!
                </span>
              </div>
            </div>

            <button
              onClick={resetApp}
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors underline"
            >
              Contribuir com outro pet
            </button>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-20 pt-12 border-t border-white/10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <a 
                href="https://smartdog-backend-vlm0.onrender.com/termos-de-uso.html" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 hover:text-cyan-200 transition-colors font-medium text-lg"
              >
                Termos de Uso
              </a>
              <a 
                href="https://smartdog-backend-vlm0.onrender.com/politica-de-privacidade.html" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 hover:text-cyan-200 transition-colors font-medium text-lg"
              >
                Política de Privacidade
              </a>
            </div>
            
            <p className="text-gray-500 text-sm">
              © 2024 Pet AI Transform. {petCount.toLocaleString()} pets já contribuíram!
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
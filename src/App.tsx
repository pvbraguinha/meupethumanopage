import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Heart, 
  Users, 
  Trophy, 
  ArrowRight,
  CheckCircle,
  Clock,
  Star,
  Target,
  Brain,
  Globe,
  Gift
} from 'lucide-react';

interface RoadmapPhase {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  status: 'completed' | 'in-progress' | 'upcoming';
  items: Array<{
    text: string;
    status: 'completed' | 'in-progress' | 'upcoming';
  }>;
  bgColor: string;
}

function App() {
  const [visiblePhases, setVisiblePhases] = useState<number[]>([]);
  const [petCount, setPetCount] = useState<number>(0);

  // Buscar contador de pets
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
        const savedCount = localStorage.getItem('petContributionCount');
        setPetCount(savedCount ? parseInt(savedCount) : 2847);
      }
    };

    fetchPetCount();
  }, []);

  // Animação de entrada das fases
  useEffect(() => {
    const timer = setInterval(() => {
      setVisiblePhases(prev => {
        if (prev.length < roadmapPhases.length) {
          return [...prev, prev.length];
        }
        clearInterval(timer);
        return prev;
      });
    }, 300);

    return () => clearInterval(timer);
  }, []);

  const roadmapPhases: RoadmapPhase[] = [
    {
      id: 1,
      title: "Resgate o Futuro dos Pets",
      subtitle: "Coleta pública de imagens da comunidade",
      description: "Uploads feitos por tutores e ONGs",
      icon: <Heart className="w-8 h-8" />,
      status: 'in-progress',
      bgColor: 'bg-gradient-to-br from-blue-100 to-blue-200',
      items: [
        { text: "Uploads feitos por tutores e ONGs", status: 'completed' },
        { text: "Criação da maior base de focinhos da Europa e América Latina", status: 'in-progress' },
        { text: "Treinamento do modelo de IA", status: 'in-progress' },
        { text: "Acurácia de 98% no reconhecimento facial e de focinho", status: 'in-progress' }
      ]
    },
    {
      id: 2,
      title: "Treine a Inteligência",
      subtitle: "Lançamento do MVP com tecnologia de reconhecimento de focinho",
      description: "Backend Laravel + API funcional",
      icon: <Brain className="w-8 h-8" />,
      status: 'completed',
      bgColor: 'bg-gradient-to-br from-green-100 to-green-200',
      items: [
        { text: "Backend Laravel + API funcional", status: 'completed' },
        { text: "Upload de imagens direto no S3", status: 'completed' },
        { text: "Primeiros testes com ONGs parceiras", status: 'completed' }
      ]
    },
    {
      id: 3,
      title: "Conexão Global",
      subtitle: "Expansão da tecnologia para prefeituras, clínicas e ONGs",
      description: "Sistema aberto ao público",
      icon: <Globe className="w-8 h-8" />,
      status: 'upcoming',
      bgColor: 'bg-gradient-to-br from-purple-100 to-purple-200',
      items: [
        { text: "Sistema aberto ao público", status: 'upcoming' },
        { text: "Parcerias com iniciativas públicas e privadas", status: 'upcoming' }
      ]
    },
    {
      id: 4,
      title: "SmartDog DAO?",
      subtitle: "Possível token ou sistema de recompensa para ONGs e tutores que contribuírem",
      description: "Recompensas por imagens úteis",
      icon: <Gift className="w-8 h-8" />,
      status: 'upcoming',
      bgColor: 'bg-gradient-to-br from-yellow-100 to-yellow-200',
      items: [
        { text: "Recompensas por imagens úteis", status: 'upcoming' },
        { text: "Reconhecimento via NFTs não-transferíveis", status: 'upcoming' }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />;
      default:
        return <Star className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleContributeClick = () => {
    // Redirecionar para a página de upload
    window.location.href = '/upload';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              SmartDog
            </h1>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            O seu pet pode salvar um animal perdido
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Crie esperança com uma simples foto.
          </p>

          {/* Stats Cards - Mais limpo */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="clean-stat-card bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300">
              <Camera className="w-8 h-8 text-blue-600 mb-2" />
              <div className="text-3xl font-black text-blue-700 mb-1">
                {petCount.toLocaleString()}
              </div>
              <p className="text-blue-700 font-semibold">Pets Contribuindo</p>
            </div>
            
            <div className="clean-stat-card bg-gradient-to-br from-pink-100 to-pink-200 border-pink-300">
              <Target className="w-8 h-8 text-pink-600 mb-2" />
              <div className="text-3xl font-black text-pink-700 mb-1">98%</div>
              <p className="text-pink-700 font-semibold">Acurácia Alvo</p>
            </div>
            
            <div className="clean-stat-card bg-gradient-to-br from-green-100 to-green-200 border-green-300">
              <Trophy className="w-8 h-8 text-green-600 mb-2" />
              <div className="text-3xl font-black text-green-700 mb-1">∞</div>
              <p className="text-green-700 font-semibold">Vidas Salvas</p>
            </div>
          </div>
        </header>

        {/* Roadmap Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-800 mb-4">
              Nosso Roadmap de Esperança
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cada fase nos aproxima mais de reunir pets perdidos com suas famílias
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-6">
            {roadmapPhases.map((phase, index) => (
              <div
                key={phase.id}
                className={`roadmap-phase-clean ${visiblePhases.includes(index) ? 'visible' : ''}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className={`clean-phase-card ${phase.bgColor} border-2 border-white shadow-lg`}>
                  <div className="flex flex-col lg:flex-row items-start gap-6">
                    {/* Phase Number & Icon */}
                    <div className="flex-shrink-0">
                      <div className="clean-phase-icon bg-white shadow-md">
                        <div className="text-sm font-bold text-gray-600 mb-1">
                          Fase {phase.id}
                        </div>
                        <div className="text-blue-600">
                          {phase.icon}
                        </div>
                      </div>
                    </div>

                    {/* Phase Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            {phase.title}
                          </h3>
                          <p className="text-lg text-gray-700 mb-2">
                            {phase.subtitle}
                          </p>
                          <p className="text-gray-600">
                            {phase.description}
                          </p>
                        </div>
                        
                        <div className={`clean-status-badge ${phase.status}`}>
                          {phase.status === 'completed' && <CheckCircle className="w-4 h-4" />}
                          {phase.status === 'in-progress' && <Clock className="w-4 h-4 animate-pulse" />}
                          {phase.status === 'upcoming' && <Star className="w-4 h-4" />}
                          <span className="text-xs font-bold">
                            {phase.status === 'in-progress' ? 'Em Progresso' : 
                             phase.status === 'completed' ? 'Concluído' : 'Em Breve'}
                          </span>
                        </div>
                      </div>

                      {/* Phase Items */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {phase.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-center space-x-3 p-3 rounded-lg bg-white/70 hover:bg-white/90 transition-all duration-200 shadow-sm"
                          >
                            {getStatusIcon(item.status)}
                            <span className={`text-sm font-medium ${
                              item.status === 'completed' ? 'text-green-700' : 
                              item.status === 'in-progress' ? 'text-yellow-700' : 'text-gray-600'
                            }`}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mb-16">
          <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-white/50">
            <h2 className="text-4xl font-black text-gray-800 mb-4">
              O futuro dos animais perdidos começa com você.
            </h2>
            
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Cada foto que você contribui treina nossa IA para salvar mais vidas. 
              Seja parte desta revolução tecnológica com propósito social!
            </p>

            <button
              onClick={handleContributeClick}
              className="clean-cta-button group"
            >
              <div className="flex items-center justify-center space-x-3">
                <Camera className="w-6 h-6 group-hover:animate-pulse" />
                <span className="text-xl font-black">Contribuir com Imagens</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <div className="flex items-center justify-center mt-6 space-x-2">
              <Users className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600 font-medium">
                Junte-se a {petCount.toLocaleString()} pets que já contribuíram!
              </span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Heart className="w-6 h-6 text-pink-500" />
              <span className="text-lg text-gray-700 font-semibold">
                Feito com amor para reunir famílias
              </span>
              <Heart className="w-6 h-6 text-pink-500" />
            </div>
            
            <p className="text-gray-500">
              © 2024 SmartDog. Tecnologia que salva vidas.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
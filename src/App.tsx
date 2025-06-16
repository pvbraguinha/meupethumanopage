import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Heart, 
  Users, 
  ArrowRight,
  CheckCircle,
  Clock,
  Brain,
  Globe,
  Gift,
  Zap
} from 'lucide-react';

interface RoadmapPhase {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  items: Array<{
    text: string;
    status: 'completed' | 'in-progress' | 'upcoming';
  }>;
  characterColor: string;
  characterExpression: string;
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
    }, 800);

    return () => clearInterval(timer);
  }, []);

  const roadmapPhases: RoadmapPhase[] = [
    {
      id: 1,
      title: "Resgate o Futuro dos Pets",
      subtitle: "Coleta pública de imagens da comunidade",
      description: "Uploads feitos por tutores e ONGs",
      status: 'completed',
      characterColor: 'bg-blue-400',
      characterExpression: '😊',
      items: [
        { text: "Website Launch", status: 'completed' },
        { text: "Social Media Presence", status: 'completed' },
        { text: "Community Growth", status: 'completed' }
      ]
    },
    {
      id: 2,
      title: "Treine a Inteligência",
      subtitle: "Lançamento do MVP com tecnologia de reconhecimento",
      description: "Backend Laravel + API funcional",
      status: 'in-progress',
      characterColor: 'bg-pink-400',
      characterExpression: '😄',
      items: [
        { text: "Smart Contract Audit", status: 'in-progress' },
        { text: "Exchange Listings", status: 'in-progress' },
        { text: "Strategic Partnerships", status: 'upcoming' }
      ]
    },
    {
      id: 3,
      title: "Conexão Global",
      subtitle: "Expansão da tecnologia para prefeituras e ONGs",
      description: "Sistema aberto ao público",
      status: 'upcoming',
      characterColor: 'bg-green-400',
      characterExpression: '😎',
      items: [
        { text: "NFT Collection", status: 'upcoming' },
        { text: "Governance Token", status: 'upcoming' },
        { text: "Community DAO", status: 'upcoming' }
      ]
    },
    {
      id: 4,
      title: "SmartDog DAO",
      subtitle: "Sistema de recompensa para ONGs e tutores",
      description: "Recompensas por imagens úteis",
      status: 'upcoming',
      characterColor: 'bg-yellow-400',
      characterExpression: '🤗',
      items: [
        { text: "Global Expansion", status: 'upcoming' },
        { text: "Mobile App", status: 'upcoming' },
        { text: "Ecosystem Growth", status: 'upcoming' }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">
            <CheckCircle className="w-4 h-4" />
            <span>Completed!</span>
          </div>
        );
      case 'in-progress':
        return (
          <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold">
            <Zap className="w-4 h-4 animate-pulse" />
            <span>In progress!</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-bold">
            <Clock className="w-4 h-4" />
            <span>Upcoming..</span>
          </div>
        );
    }
  };

  const handleContributeClick = () => {
    // Redirecionar para a página de upload
    window.location.href = '/upload';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-300 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-300 rounded-full blur-lg"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-blue-300 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-green-300 rounded-full blur-lg"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="mb-8">
            <p className="text-yellow-300 text-lg font-bold mb-4">Story Timeline</p>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tight">
              ROADMAP
            </h1>
          </div>
          
          <div className="flex items-center justify-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              O seu pet pode salvar um animal perdido
            </h2>
          </div>
          
          <p className="text-xl text-purple-200 max-w-2xl mx-auto mb-8">
            Crie esperança com uma simples foto.
          </p>

          {/* Stats */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <Camera className="w-6 h-6 text-yellow-300" />
                <span className="text-2xl font-black">{petCount.toLocaleString()}</span>
                <span className="text-purple-200">pets contribuindo!</span>
              </div>
            </div>
          </div>
        </header>

        {/* Roadmap Phases */}
        <section className="max-w-6xl mx-auto space-y-12">
          {roadmapPhases.map((phase, index) => (
            <div
              key={phase.id}
              className={`roadmap-phase-memecoin ${visiblePhases.includes(index) ? 'visible' : ''}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Character */}
                <div className="flex-shrink-0 relative">
                  <div className={`memecoin-character ${phase.characterColor} w-32 h-32 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30`}>
                    <div className="text-4xl">{phase.characterExpression}</div>
                    {/* Character arms */}
                    <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-8 h-2 bg-current rounded-full opacity-80"></div>
                    <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-2 bg-current rounded-full opacity-80"></div>
                    {/* Character legs */}
                    <div className="absolute -bottom-2 left-1/3 w-2 h-6 bg-current rounded-full opacity-80"></div>
                    <div className="absolute -bottom-2 right-1/3 w-2 h-6 bg-current rounded-full opacity-80"></div>
                  </div>
                  
                  {/* Phase number */}
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-purple-800 w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shadow-lg">
                    Phase #{phase.id}
                  </div>
                </div>

                {/* Phase Content */}
                <div className="flex-1">
                  <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                      <div className="mb-4 lg:mb-0">
                        {getStatusBadge(phase.status)}
                      </div>
                    </div>
                    
                    <h3 className="text-3xl font-black text-yellow-300 mb-4">
                      {phase.title}
                    </h3>
                    
                    <p className="text-lg text-purple-100 mb-6 leading-relaxed">
                      {phase.subtitle}
                    </p>

                    {/* Phase Items */}
                    <div className="space-y-3">
                      {phase.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-center space-x-3 text-purple-100"
                        >
                          <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                          <span className="font-medium">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Call to Action */}
        <section className="text-center mt-20">
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 shadow-2xl">
            <h2 className="text-4xl font-black text-yellow-300 mb-6">
              O futuro dos animais perdidos começa com você.
            </h2>
            
            <p className="text-xl text-purple-100 mb-10 leading-relaxed">
              Cada foto que você contribui treina nossa IA para salvar mais vidas. 
              Seja parte desta revolução tecnológica com propósito social!
            </p>

            <button
              onClick={handleContributeClick}
              className="memecoin-cta-button group"
            >
              <div className="flex items-center justify-center space-x-3">
                <Camera className="w-6 h-6 group-hover:animate-pulse" />
                <span className="text-xl font-black">Contribuir com Imagens</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <div className="flex items-center justify-center mt-8 space-x-2">
              <Users className="w-5 h-5 text-purple-200" />
              <span className="text-purple-200 font-medium">
                Junte-se a {petCount.toLocaleString()} pets que já contribuíram!
              </span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center mt-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Heart className="w-6 h-6 text-pink-400 animate-pulse" />
            <span className="text-lg text-purple-200 font-semibold">
              Feito com amor para reunir famílias
            </span>
            <Heart className="w-6 h-6 text-pink-400 animate-pulse" />
          </div>
          
          <p className="text-purple-300">
            © 2024 SmartDog. Tecnologia que salva vidas.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
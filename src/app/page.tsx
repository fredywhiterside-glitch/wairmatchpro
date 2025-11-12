"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { 
  Scissors, 
  Camera, 
  Sparkles, 
  Crown, 
  Heart, 
  Star, 
  Upload,
  CheckCircle,
  ArrowRight,
  Users,
  TrendingUp,
  Award,
  Zap,
  X,
  RotateCcw,
  Download,
  Share2,
  Lock,
  Gift,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'

// Tipos de dados
type FaceShape = 'oval' | 'round' | 'square' | 'heart' | 'diamond' | 'oblong'

interface Haircut {
  id: string
  name: string
  description: string
  image: string
  difficulty: 'easy' | 'medium' | 'hard'
  suitableFaces: FaceShape[]
  trending: boolean
  premium: boolean
}

// Base de dados de cortes
const haircuts: Haircut[] = [
  {
    id: '1',
    name: 'Bob Clássico',
    description: 'Corte atemporal que valoriza rostos ovais e redondos',
    image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop',
    difficulty: 'easy',
    suitableFaces: ['oval', 'round', 'heart'],
    trending: true,
    premium: false
  },
  {
    id: '2',
    name: 'Pixie Moderno',
    description: 'Corte ousado perfeito para rostos ovais e diamante',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=400&fit=crop',
    difficulty: 'hard',
    suitableFaces: ['oval', 'diamond', 'heart'],
    trending: true,
    premium: true
  },
  {
    id: '3',
    name: 'Long Bob (Lob)',
    description: 'Versatilidade máxima para todos os formatos de rosto',
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400&h=400&fit=crop',
    difficulty: 'medium',
    suitableFaces: ['oval', 'round', 'square', 'heart', 'diamond', 'oblong'],
    trending: false,
    premium: false
  },
  {
    id: '4',
    name: 'Shag Moderno',
    description: 'Corte em camadas que adiciona movimento e textura',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop',
    difficulty: 'medium',
    suitableFaces: ['oval', 'square', 'oblong'],
    trending: true,
    premium: true
  },
  {
    id: '5',
    name: 'Camadas Longas',
    description: 'Elegância e movimento para cabelos longos',
    image: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=400&h=400&fit=crop',
    difficulty: 'easy',
    suitableFaces: ['oval', 'round', 'square'],
    trending: false,
    premium: false
  },
  {
    id: '6',
    name: 'Curtain Bangs',
    description: 'Franja cortina que suaviza traços angulares',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop',
    difficulty: 'medium',
    suitableFaces: ['square', 'diamond', 'oblong'],
    trending: true,
    premium: true
  }
]

// Descrições dos formatos de rosto
const faceShapeDescriptions = {
  oval: {
    name: 'Oval',
    description: 'Rosto equilibrado com testa ligeiramente mais larga que o queixo',
    icon: '🥚',
    tips: 'Você tem sorte! Quase todos os cortes ficam bem em você.'
  },
  round: {
    name: 'Redondo',
    description: 'Largura e altura similares, com contornos suaves',
    icon: '⭕',
    tips: 'Cortes com volume no topo e laterais mais curtas valorizam seu rosto.'
  },
  square: {
    name: 'Quadrado',
    description: 'Testa, bochechas e maxilar com larguras similares',
    icon: '⬜',
    tips: 'Cortes com camadas suaves ajudam a amenizar os ângulos.'
  },
  heart: {
    name: 'Coração',
    description: 'Testa larga com queixo mais estreito',
    icon: '💖',
    tips: 'Cortes que adicionam volume na parte inferior equilibram as proporções.'
  },
  diamond: {
    name: 'Diamante',
    description: 'Bochechas mais largas, testa e queixo estreitos',
    icon: '💎',
    tips: 'Cortes com volume nas laterais da testa e queixo são ideais.'
  },
  oblong: {
    name: 'Oblongo',
    description: 'Rosto mais longo que largo, com contornos retos',
    icon: '📏',
    tips: 'Cortes com volume nas laterais ajudam a equilibrar o comprimento.'
  }
}

// Simulação de análise de IA
const analyzePhoto = (imageData: string): { faceShape: FaceShape; confidence: number } => {
  // Simulação de análise - em produção seria uma API real
  const shapes: FaceShape[] = ['oval', 'round', 'square', 'heart', 'diamond', 'oblong']
  const randomShape = shapes[Math.floor(Math.random() * shapes.length)]
  const confidence = Math.floor(Math.random() * 20) + 80 // 80-99%
  
  return {
    faceShape: randomShape,
    confidence
  }
}

export default function HaircutPhotoApp() {
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<{ faceShape: FaceShape; confidence: number } | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [hasUsedFreeTrial, setHasUsedFreeTrial] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraPermission, setCameraPermission] = useState<'unknown' | 'granted' | 'denied'>('unknown')
  const [isRequestingPermission, setIsRequestingPermission] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Verificar se já usou o teste grátis
  useEffect(() => {
    const usedTrial = localStorage.getItem('hairMatch_usedFreeTrial')
    const premiumStatus = localStorage.getItem('hairMatch_isPremium')
    
    if (usedTrial === 'true') {
      setHasUsedFreeTrial(true)
    }
    
    if (premiumStatus === 'true') {
      setIsPremium(true)
    }
  }, [])

  // Verificar permissão da câmera ao carregar
  useEffect(() => {
    checkCameraPermission()
  }, [])

  // Limpar stream quando componente desmonta
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  const checkCameraPermission = async () => {
    try {
      if (!navigator.permissions) {
        setCameraPermission('unknown')
        return
      }

      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName })
      setCameraPermission(permission.state as 'granted' | 'denied')
      
      // Escutar mudanças na permissão
      permission.onchange = () => {
        setCameraPermission(permission.state as 'granted' | 'denied')
      }
    } catch (error) {
      console.log('Não foi possível verificar permissão da câmera:', error)
      setCameraPermission('unknown')
    }
  }

  const requestCameraPermission = async () => {
    setIsRequestingPermission(true)
    setCameraError(null)

    try {
      // Verificar se o navegador suporta getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Seu navegador não suporta acesso à câmera. Tente usar Chrome, Firefox ou Safari.')
      }

      // Solicitar permissão para câmera
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      })
      
      setCameraPermission('granted')
      setStream(mediaStream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        
        // Aguardar o vídeo carregar
        videoRef.current.onloadedmetadata = () => {
          setShowCamera(true)
          setIsRequestingPermission(false)
        }
        
        // Tratar erros do vídeo
        videoRef.current.onerror = (e) => {
          console.error('Erro no vídeo:', e)
          setCameraError('Erro ao carregar o vídeo da câmera')
          stopCamera()
          setIsRequestingPermission(false)
        }
      }
    } catch (error: any) {
      console.error('Erro ao acessar câmera:', error)
      setIsRequestingPermission(false)
      
      let errorMessage = 'Não foi possível acessar a câmera.'
      
      if (error.name === 'NotAllowedError') {
        setCameraPermission('denied')
        errorMessage = 'Permissão para câmera foi negada. Clique no ícone da câmera na barra de endereços do navegador e permita o acesso.'
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'Nenhuma câmera foi encontrada no seu dispositivo.'
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Seu navegador não suporta acesso à câmera. Tente usar Chrome, Firefox ou Safari.'
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Câmera está sendo usada por outro aplicativo. Feche outros apps que possam estar usando a câmera.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setCameraError(errorMessage)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Verificar se pode usar (teste grátis ou premium)
    if (hasUsedFreeTrial && !isPremium) {
      alert('Seu teste grátis expirou! Assine o plano premium para continuar usando.')
      return
    }

    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        setCapturedPhoto(imageData)
        startAnalysis(imageData)
        
        // Marcar teste grátis como usado se não for premium
        if (!isPremium && !hasUsedFreeTrial) {
          localStorage.setItem('hairMatch_usedFreeTrial', 'true')
          setHasUsedFreeTrial(true)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    // Verificar se pode usar (teste grátis ou premium)
    if (hasUsedFreeTrial && !isPremium) {
      alert('Seu teste grátis expirou! Assine o plano premium para continuar usando.')
      return
    }

    await requestCameraPermission()
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setShowCamera(false)
    setCameraError(null)
    setIsRequestingPermission(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext('2d')
      
      // Definir dimensões do canvas baseado no vídeo
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 480
      
      if (context && video.videoWidth > 0 && video.videoHeight > 0) {
        // Desenhar frame do vídeo no canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        // Converter para imagem
        const imageData = canvas.toDataURL('image/jpeg', 0.8)
        setCapturedPhoto(imageData)
        
        // Parar câmera
        stopCamera()
        
        // Iniciar análise
        startAnalysis(imageData)
        
        // Marcar teste grátis como usado se não for premium
        if (!isPremium && !hasUsedFreeTrial) {
          localStorage.setItem('hairMatch_usedFreeTrial', 'true')
          setHasUsedFreeTrial(true)
        }
      } else {
        alert('Erro ao capturar foto. Tente novamente.')
      }
    }
  }

  const startAnalysis = (imageData: string) => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    
    // Simular progresso de análise
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          // Simular resultado da análise
          setTimeout(() => {
            const result = analyzePhoto(imageData)
            setAnalysisResult(result)
            setIsAnalyzing(false)
            setShowResults(true)
          }, 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)
  }

  const resetApp = () => {
    setCapturedPhoto(null)
    setAnalysisResult(null)
    setShowResults(false)
    setIsAnalyzing(false)
    setAnalysisProgress(0)
    setShowCamera(false)
    setCameraError(null)
    stopCamera()
  }

  const handlePremiumUpgrade = () => {
    // Redirecionar para MercadoPago
    window.open('https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=f3e587d9e2a146479f139de7748ac610', '_blank')
    
    // Simular que o usuário se tornou premium após o pagamento
    // Em produção, isso seria confirmado via webhook do MercadoPago
    setTimeout(() => {
      const confirmed = confirm('Pagamento realizado com sucesso? (Simulação - clique OK para ativar premium)')
      if (confirmed) {
        setIsPremium(true)
        localStorage.setItem('hairMatch_isPremium', 'true')
        alert('🎉 Parabéns! Agora você tem acesso premium ilimitado!')
      }
    }, 2000)
  }

  const getRecommendations = () => {
    if (!analysisResult) return []
    
    return haircuts
      .filter(cut => cut.suitableFaces.includes(analysisResult.faceShape))
      .sort((a, b) => {
        if (a.trending && !b.trending) return -1
        if (!a.trending && b.trending) return 1
        return 0
      })
  }

  // Modal de permissão da câmera
  if (isRequestingPermission) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
        <Card className="max-w-md mx-4 bg-white">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
            <CardTitle className="text-xl text-gray-800">
              Solicitando Permissão
            </CardTitle>
            <CardDescription>
              Aguarde enquanto solicitamos acesso à sua câmera...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm text-gray-600">Processando...</span>
            </div>
            <Button variant="outline" onClick={stopCamera}>
              Cancelar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Tela de resultados
  if (showResults && analysisResult && capturedPhoto) {
    const recommendations = getRecommendations()
    const freeRecommendations = recommendations.filter(cut => !cut.premium).slice(0, 2)
    const premiumRecommendations = recommendations.filter(cut => cut.premium)

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Scissors className="w-8 h-8 text-purple-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                HairMatch Pro
              </h1>
              {isPremium && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  PREMIUM
                </Badge>
              )}
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Análise completa da sua foto! Veja suas recomendações personalizadas.
            </p>
            
            {/* Status do usuário */}
            {!isPremium && hasUsedFreeTrial && (
              <div className="bg-orange-100 border border-orange-200 rounded-lg p-4 mt-4 max-w-md mx-auto">
                <p className="text-orange-800 text-sm font-medium">
                  ⚠️ Teste grátis usado! Assine para análises ilimitadas.
                </p>
              </div>
            )}
          </div>

          {/* Foto Analisada e Resultado */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Foto Capturada */}
            <Card className="border-2 border-purple-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-xl text-purple-800">Sua Foto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <img 
                    src={capturedPhoto} 
                    alt="Foto analisada"
                    className="w-full h-80 object-cover rounded-lg"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button size="sm" variant="secondary" className="bg-white/80">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="bg-white/80">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resultado da Análise */}
            <Card className="border-2 border-green-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{faceShapeDescriptions[analysisResult.faceShape].icon}</div>
                <CardTitle className="text-2xl text-green-800">
                  Formato: {faceShapeDescriptions[analysisResult.faceShape].name}
                </CardTitle>
                <CardDescription className="text-lg">
                  {faceShapeDescriptions[analysisResult.faceShape].description}
                </CardDescription>
                <Badge className="bg-green-100 text-green-800 mt-2">
                  {analysisResult.confidence}% de precisão
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="bg-green-100 p-4 rounded-lg">
                  <p className="text-green-800 font-medium text-center">
                    💡 {faceShapeDescriptions[analysisResult.faceShape].tips}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recomendações Gratuitas */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Gift className="w-6 h-6 text-green-500" />
              Suas Recomendações {!isPremium ? 'Gratuitas' : 'Básicas'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {freeRecommendations.map((cut) => (
                <Card key={cut.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-yellow-200">
                  <div className="relative">
                    <img 
                      src={cut.image} 
                      alt={cut.name}
                      className="w-full h-64 object-cover"
                    />
                    {cut.trending && (
                      <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {cut.name}
                      <Badge variant={cut.difficulty === 'easy' ? 'default' : cut.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                        {cut.difficulty}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{cut.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Seção Premium */}
          {!isPremium && premiumRecommendations.length > 0 && (
            <div className="mb-8">
              <Card className="border-2 border-gradient-to-r from-purple-400 to-pink-400 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Crown className="w-8 h-8 text-purple-600" />
                    <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Recomendações Premium
                    </CardTitle>
                  </div>
                  <CardDescription className="text-lg">
                    Desbloqueie {premiumRecommendations.length} cortes exclusivos e análises ilimitadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {premiumRecommendations.slice(0, 2).map((cut) => (
                      <div key={cut.id} className="relative">
                        <Card className="overflow-hidden opacity-75">
                          <div className="relative">
                            <img 
                              src={cut.image} 
                              alt={cut.name}
                              className="w-full h-48 object-cover blur-sm"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Lock className="w-12 h-12 text-white" />
                            </div>
                          </div>
                          <CardHeader>
                            <CardTitle className="text-gray-600">{cut.name}</CardTitle>
                            <CardDescription className="text-gray-500">
                              Análise detalhada disponível no plano premium
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <div className="bg-white p-6 rounded-xl border-2 border-purple-200 mb-6">
                      <div 
                        className="bg-red-500 text-white px-4 py-2 rounded-full inline-block mb-4 cursor-pointer hover:bg-red-600 transition-colors"
                        onClick={handlePremiumUpgrade}
                      >
                        🔥 OFERTA ESPECIAL - TEMPO LIMITADO!
                      </div>
                      
                      <h3 className="text-xl font-bold text-purple-800 mb-4">
                        🚀 Upgrade para Premium
                      </h3>
                      
                      <div 
                        className="flex items-center justify-center gap-6 mb-6 cursor-pointer"
                        onClick={handlePremiumUpgrade}
                      >
                        <div className="text-center hover:scale-105 transition-transform">
                          <div className="text-gray-400 line-through text-lg">De R$ 50</div>
                          <div className="text-4xl font-bold text-green-600">R$ 19</div>
                          <div className="text-sm text-gray-600">/mês</div>
                          <Badge className="bg-red-100 text-red-800 text-xs mt-1">62% OFF</Badge>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-left mb-6">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Análises ilimitadas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Simulador virtual de cortes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Cortes exclusivos e tendências</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Suporte de estilistas profissionais</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Histórico de todas suas análises</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Recomendações personalizadas</span>
                        </div>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <p className="text-yellow-800 text-sm font-medium">
                          ⏰ Esta oferta expira em 24 horas! Não perca a chance de economizar R$ 31/mês
                        </p>
                      </div>

                      <Button 
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 text-lg"
                        onClick={handlePremiumUpgrade}
                      >
                        <Crown className="w-5 h-5 mr-2" />
                        Assinar Premium - R$ 19/mês
                      </Button>
                      
                      <p className="text-xs text-gray-500 mt-2">
                        Cancele quando quiser • Sem compromisso • Garantia de 7 dias
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Seção Premium Ativa */}
          {isPremium && premiumRecommendations.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Crown className="w-6 h-6 text-yellow-500" />
                Suas Recomendações Premium
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {premiumRecommendations.map((cut) => (
                  <Card key={cut.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-purple-200">
                    <div className="relative">
                      <img 
                        src={cut.image} 
                        alt={cut.name}
                        className="w-full h-48 object-cover"
                      />
                      {cut.trending && (
                        <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                      <Badge className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {cut.name}
                        <Badge variant={cut.difficulty === 'easy' ? 'default' : cut.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                          {cut.difficulty}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{cut.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={resetApp}
              className="border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {isPremium ? 'Nova Análise' : hasUsedFreeTrial ? 'Assinar para Nova Análise' : 'Analisar Nova Foto'}
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar Resultado
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Tela de análise
  if (isAnalyzing && capturedPhoto) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto border-2 border-purple-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-purple-600 animate-pulse" />
              </div>
              <CardTitle className="text-2xl text-purple-800">
                Analisando sua foto...
              </CardTitle>
              <CardDescription className="text-lg">
                Nossa IA está identificando o formato do seu rosto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <img 
                  src={capturedPhoto} 
                  alt="Foto sendo analisada"
                  className="w-full h-80 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <div className="bg-white/90 p-4 rounded-lg">
                    <Zap className="w-8 h-8 text-purple-600 animate-bounce mx-auto" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-600 font-medium">Progresso da análise</span>
                  <span className="text-gray-500">{Math.round(analysisProgress)}%</span>
                </div>
                <Progress value={analysisProgress} className="h-3 bg-purple-100" />
              </div>
              
              <div className="text-center text-sm text-gray-600">
                <p>Identificando características faciais...</p>
                <p className="mt-1">Isso pode levar alguns segundos</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Modal da câmera
  if (showCamera) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="relative w-full h-full">
          <video 
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute top-4 right-4">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={stopCamera}
              className="bg-white/80 hover:bg-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <Button 
              size="lg"
              onClick={capturePhoto}
              className="bg-white text-black hover:bg-gray-100 rounded-full w-16 h-16 p-0 shadow-lg"
            >
              <Camera className="w-8 h-8" />
            </Button>
          </div>
          
          <div className="absolute bottom-8 left-8">
            <p className="text-white text-sm bg-black/50 px-3 py-1 rounded">
              Posicione seu rosto no centro da tela
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Tela principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Scissors className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              HairMatch Pro
            </h1>
            {isPremium && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                <Crown className="w-4 h-4 mr-1" />
                PREMIUM
              </Badge>
            )}
          </div>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto mb-6">
            Descubra o corte de cabelo perfeito para você! Tire uma foto e nossa IA analisará seu formato de rosto para recomendações personalizadas.
          </p>
          
          {/* Status do usuário */}
          {!isPremium && (
            <div 
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full inline-block mb-8 cursor-pointer hover:from-red-600 hover:to-pink-600 transition-colors"
              onClick={handlePremiumUpgrade}
            >
              <span className="text-sm font-medium">🔥 OFERTA ESPECIAL: </span>
              <span className="line-through text-red-200">R$ 50/mês</span>
              <span className="text-xl font-bold ml-2">R$ 19/mês</span>
              <span className="text-sm ml-2">(62% OFF)</span>
            </div>
          )}

          {hasUsedFreeTrial && !isPremium && (
            <div className="bg-orange-100 border border-orange-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <p className="text-orange-800 text-sm font-medium">
                ⚠️ Teste grátis usado! Assine para análises ilimitadas.
              </p>
            </div>
          )}
        </div>

        {/* Captura de Foto */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card className="border-2 border-purple-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-purple-800 mb-2">
                {isPremium ? 'Análise Ilimitada!' : hasUsedFreeTrial ? 'Assine para Continuar' : 'Comece Agora - Teste Grátis!'}
              </CardTitle>
              <CardDescription className="text-lg">
                {isPremium 
                  ? 'Tire quantas fotos quiser e descubra todos os cortes perfeitos para você'
                  : hasUsedFreeTrial 
                    ? 'Seu teste grátis expirou. Assine o plano premium para continuar'
                    : 'Tire uma foto ou faça upload de uma imagem para seu teste gratuito'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Erro da câmera */}
              {cameraError && (
                <div className="bg-red-100 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-red-800 text-sm font-medium mb-2">
                        Problema com a câmera:
                      </p>
                      <p className="text-red-700 text-sm mb-3">
                        {cameraError}
                      </p>
                      {cameraPermission === 'denied' && (
                        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                          <p className="font-medium mb-1">Como permitir acesso à câmera:</p>
                          <p>1. Clique no ícone da câmera na barra de endereços</p>
                          <p>2. Selecione "Permitir" para este site</p>
                          <p>3. Recarregue a página e tente novamente</p>
                        </div>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          setCameraError(null)
                          checkCameraPermission()
                        }}
                        className="mt-2"
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Tentar Novamente
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <Button 
                  size="lg"
                  onClick={startCamera}
                  disabled={hasUsedFreeTrial && !isPremium}
                  className={`h-16 ${
                    hasUsedFreeTrial && !isPremium 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                  }`}
                >
                  <Camera className="w-6 h-6 mr-3" />
                  {hasUsedFreeTrial && !isPremium ? 'Assine para Usar' : 'Usar Câmera'}
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={hasUsedFreeTrial && !isPremium}
                  className={`h-16 ${
                    hasUsedFreeTrial && !isPremium 
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
                      : 'border-2 border-purple-200 text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <Upload className="w-6 h-6 mr-3" />
                  {hasUsedFreeTrial && !isPremium ? 'Assine para Usar' : 'Upload de Foto'}
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {/* Botão de upgrade se teste expirou */}
              {hasUsedFreeTrial && !isPremium && (
                <div className="text-center">
                  <Button 
                    size="lg"
                    onClick={handlePremiumUpgrade}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
                  >
                    <Crown className="w-5 h-5 mr-2" />
                    Assinar Premium - R$ 19/mês
                  </Button>
                </div>
              )}
              
              <div className="text-center text-sm text-gray-500">
                <p>Suas fotos são processadas com segurança e não são armazenadas</p>
                <p className="mt-1">Funciona melhor com fotos frontais bem iluminadas</p>
                {!isPremium && !hasUsedFreeTrial && (
                  <p className="mt-2 font-medium text-green-600">
                    🎁 Primeira análise grátis! Depois apenas R$ 19/mês
                  </p>
                )}
                {cameraPermission === 'denied' && (
                  <p className="mt-2 text-amber-600 font-medium">
                    📷 Permissão da câmera negada. Use upload de foto ou permita acesso à câmera.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Por que escolher o HairMatch Pro?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-2 border-purple-100 hover:border-purple-300 transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-purple-800">IA Especializada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Nossa inteligência artificial foi treinada com milhares de combinações de rostos e cortes para dar as melhores recomendações.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-purple-100 hover:border-purple-300 transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-purple-800">+50k Usuárias</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Mais de 50 mil mulheres já encontraram seu corte perfeito com nossa plataforma. Junte-se a elas!
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-purple-100 hover:border-purple-300 transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-purple-800">Aprovado por Profissionais</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Desenvolvido em parceria com estilistas renomados e aprovado por profissionais da beleza.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            O que nossas usuárias dizem
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Incrível! Nunca soube que meu rosto era formato coração. As recomendações foram perfeitas e meu novo corte ficou maravilhoso!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">M</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Maria Silva</p>
                    <p className="text-sm text-gray-600">São Paulo, SP</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "O app é muito fácil de usar e a análise foi super precisa. Economizei tempo e dinheiro indo direto no corte certo!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">A</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Ana Costa</p>
                    <p className="text-sm text-gray-600">Rio de Janeiro, RJ</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
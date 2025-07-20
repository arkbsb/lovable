import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Target,
  Zap
} from 'lucide-react'

const prioridadeCores = {
  'alta': 'bg-red-100 text-red-800 border-red-200',
  'media': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'baixa': 'bg-green-100 text-green-800 border-green-200'
}

const tipoIcons = {
  'otimizacao': AlertTriangle,
  'oportunidade': TrendingUp,
  'alerta': AlertTriangle
}

export function Analytics() {
  const [projetos, setProjetos] = useState([])
  const [projetoSelecionado, setProjetoSelecionado] = useState('')
  const [sugestoes, setSugestoes] = useState([])
  const [metricas, setMetricas] = useState(null)
  const [carregando, setCarregando] = useState(false)

  // Simular dados iniciais
  useEffect(() => {
    setProjetos([
      { id: '1', nome: 'Campanha Verão 2025' },
      { id: '2', nome: 'Lançamento Produto X' }
    ])
  }, [])

  const gerarSugestoes = async () => {
    if (!projetoSelecionado) return

    setCarregando(true)
    
    try {
      // Simular chamada para API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Dados mockados de sugestões
      const sugestoesMock = [
        {
          tipo: 'otimizacao',
          categoria: 'C1 - Custo por Seguidor',
          prioridade: 'alta',
          titulo: 'Conteúdos C1 com custo por seguidor elevado',
          descricao: 'Identificamos 2 conteúdo(s) C1 com custo por seguidor acima da média (R$ 2.15). Considere revisar o targeting, criativo ou orçamento.',
          conteudos_afetados: ['Post Motivacional #3', 'Vídeo Tutorial #2'],
          acao_recomendada: 'Revisar targeting, testar novos criativos ou ajustar orçamento diário'
        },
        {
          tipo: 'oportunidade',
          categoria: 'C1 - Melhores Práticas',
          prioridade: 'media',
          titulo: 'Replicar estratégia dos melhores conteúdos C1',
          descricao: 'O conteúdo "Post Motivacional #1" tem o melhor custo por seguidor (R$ 1.80). Considere replicar elementos deste criativo.',
          conteudos_afetados: ['Post Motivacional #1'],
          acao_recomendada: 'Analisar elementos visuais, copy e targeting dos melhores performers'
        },
        {
          tipo: 'alerta',
          categoria: 'Frequência de Exibição',
          prioridade: 'alta',
          titulo: 'Campanhas com frequência muito alta',
          descricao: '1 campanha(s) com frequência acima de 3.0. Risco de fadiga da audiência.',
          conteudos_afetados: ['Nutrição de Leads - Webinars'],
          acao_recomendada: 'Expandir audiência ou pausar temporariamente para evitar saturação'
        },
        {
          tipo: 'otimizacao',
          categoria: 'Retenção de Vídeo',
          prioridade: 'media',
          titulo: 'Baixa retenção no vídeo "Webinar Gratuito"',
          descricao: 'Taxa de retenção de apenas 28.5%. Muitos usuários não assistem até o final.',
          conteudos_afetados: ['Webinar Gratuito'],
          acao_recomendada: 'Revisar hook inicial, ritmo do vídeo e call-to-action'
        }
      ]
      
      setSugestoes(sugestoesMock)
      
      // Métricas mockadas
      setMetricas({
        resumo: {
          total_conteudos: 8,
          total_campanhas: 3,
          conteudos_por_tipo: { C1: 3, C2: 2, C3: 2, C4: 1 }
        },
        metricas_c1: {
          total_gasto: 1250,
          total_seguidores_ganhos: 580,
          custo_por_seguidor_medio: 2.15,
          melhor_custo_por_seguidor: 1.80,
          pior_custo_por_seguidor: 2.85
        },
        metricas_c2_c4: {
          total_gasto: 928,
          total_engajamento: 4200,
          custo_por_engajamento_medio: 0.22,
          melhor_custo_por_engajamento: 0.12,
          pior_custo_por_engajamento: 0.35
        }
      })
      
    } catch (error) {
      console.error('Erro ao gerar sugestões:', error)
    } finally {
      setCarregando(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getSugestaoIcon = (tipo) => {
    const IconComponent = tipoIcons[tipo] || Lightbulb
    return <IconComponent className="w-5 h-5" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analytics & Sugestões</h2>
          <p className="text-gray-600 mt-1">Análise inteligente de performance e recomendações de otimização</p>
        </div>
      </div>

      {/* Seleção de Projeto */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecione um projeto para análise
              </label>
              <Select value={projetoSelecionado} onValueChange={setProjetoSelecionado}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Escolha um projeto" />
                </SelectTrigger>
                <SelectContent>
                  {projetos.map(projeto => (
                    <SelectItem key={projeto.id} value={projeto.id}>
                      {projeto.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={gerarSugestoes}
              disabled={!projetoSelecionado || carregando}
              className="bg-blue-600 hover:bg-blue-700 mt-6"
            >
              {carregando ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analisando...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Gerar Análise
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Consolidadas */}
      {metricas && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Conteúdos</p>
                  <p className="text-2xl font-bold text-gray-900">{metricas.resumo.total_conteudos}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    C1: {metricas.resumo.conteudos_por_tipo.C1} | 
                    C2-C4: {metricas.resumo.conteudos_por_tipo.C2 + metricas.resumo.conteudos_por_tipo.C3 + metricas.resumo.conteudos_por_tipo.C4}
                  </p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          {metricas.metricas_c1 && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Custo/Seguidor Médio</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(metricas.metricas_c1.custo_por_seguidor_medio)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Melhor: {formatCurrency(metricas.metricas_c1.melhor_custo_por_seguidor)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          )}

          {metricas.metricas_c2_c4 && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Custo/Engajamento Médio</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(metricas.metricas_c2_c4.custo_por_engajamento_medio)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Melhor: {formatCurrency(metricas.metricas_c2_c4.melhor_custo_por_engajamento)}
                    </p>
                  </div>
                  <Zap className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Campanhas</p>
                  <p className="text-2xl font-bold text-gray-900">{metricas.resumo.total_campanhas}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Ativas e em análise
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sugestões */}
      {sugestoes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="w-5 h-5 mr-2" />
              Sugestões de Melhoria ({sugestoes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sugestoes.map((sugestao, index) => (
                <Alert key={index} className="border-l-4 border-l-blue-500">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getSugestaoIcon(sugestao.tipo)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{sugestao.titulo}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={prioridadeCores[sugestao.prioridade]}>
                            {sugestao.prioridade.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {sugestao.categoria}
                          </Badge>
                        </div>
                      </div>
                      
                      <AlertDescription className="text-gray-600 mb-3">
                        {sugestao.descricao}
                      </AlertDescription>
                      
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Ação Recomendada:</p>
                        <p className="text-sm text-gray-600">{sugestao.acao_recomendada}</p>
                      </div>
                      
                      {sugestao.conteudos_afetados && sugestao.conteudos_afetados.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Conteúdos/Campanhas Afetados:</p>
                          <div className="flex flex-wrap gap-2">
                            {sugestao.conteudos_afetados.map((conteudo, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {conteudo}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado vazio */}
      {!projetoSelecionado && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Análise Inteligente de Performance</h3>
            <p className="text-gray-500 text-center mb-4">
              Selecione um projeto acima para gerar sugestões personalizadas de otimização baseadas nas suas métricas de performance.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


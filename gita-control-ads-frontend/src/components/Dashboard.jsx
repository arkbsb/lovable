import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  Calendar,
  Filter
} from 'lucide-react'

// Dados mockados para demonstração
const mockData = [
  { data: '2025-01-01', custoSeguidor: 2.5, seguidores: 150 },
  { data: '2025-01-02', custoSeguidor: 2.2, seguidores: 180 },
  { data: '2025-01-03', custoSeguidor: 2.8, seguidores: 120 },
  { data: '2025-01-04', custoSeguidor: 2.1, seguidores: 200 },
  { data: '2025-01-05', custoSeguidor: 2.4, seguidores: 165 },
  { data: '2025-01-06', custoSeguidor: 2.0, seguidores: 220 },
  { data: '2025-01-07', custoSeguidor: 2.3, seguidores: 190 },
]

const melhoresCreativos = {
  C1: [
    { id: 'C1-001', identificador: 'Post Motivacional #1', custoSeguidor: 1.8, seguidores: 320 },
    { id: 'C1-002', identificador: 'Vídeo Tutorial', custoSeguidor: 2.1, seguidores: 280 },
    { id: 'C1-003', identificador: 'Carrossel Dicas', custoSeguidor: 2.3, seguidores: 250 },
  ],
  C2: [
    { id: 'C2-001', identificador: 'Webinar Gratuito', custoEngajamento: 0.15, engajamento: 1200 },
    { id: 'C2-002', identificador: 'E-book Download', custoEngajamento: 0.18, engajamento: 980 },
    { id: 'C2-003', identificador: 'Quiz Interativo', custoEngajamento: 0.12, engajamento: 1450 },
  ],
  C3: [
    { id: 'C3-001', identificador: 'Case de Sucesso', custoEngajamento: 0.22, engajamento: 850 },
    { id: 'C3-002', identificador: 'Depoimento Cliente', custoEngajamento: 0.19, engajamento: 920 },
    { id: 'C3-003', identificador: 'Demo Produto', custoEngajamento: 0.25, engajamento: 780 },
  ],
  C4: [
    { id: 'C4-001', identificador: 'Oferta Limitada', custoEngajamento: 0.35, engajamento: 650 },
    { id: 'C4-002', identificador: 'Consulta Gratuita', custoEngajamento: 0.28, engajamento: 720 },
    { id: 'C4-003', identificador: 'Trial Premium', custoEngajamento: 0.42, engajamento: 580 },
  ]
}

const tiposCores = {
  C1: 'bg-green-100 text-green-800 border-green-200',
  C2: 'bg-blue-100 text-blue-800 border-blue-200',
  C3: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  C4: 'bg-red-100 text-red-800 border-red-200'
}

export function Dashboard() {
  const [dataInicio, setDataInicio] = useState('2025-01-01')
  const [dataFim, setDataFim] = useState('2025-12-31')
  const [dadosGrafico, setDadosGrafico] = useState(mockData)

  const aplicarFiltro = () => {
    // Aqui seria feita a chamada para a API com os filtros
    console.log('Aplicando filtro:', { dataInicio, dataFim })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Visão geral das suas campanhas e métricas</p>
        </div>
        
        {/* Filtro de Data */}
        <Card className="w-96">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Label htmlFor="dataInicio" className="text-xs">Data Início</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="dataFim" className="text-xs">Data Fim</Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button onClick={aplicarFiltro} size="sm" className="mt-6">
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Seguidores</p>
                <p className="text-2xl font-bold text-gray-900">12,847</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5% este mês
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Custo por Seguidor</p>
                <p className="text-2xl font-bold text-gray-900">R$ 2,15</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  -8.2% este mês
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engajamento Total</p>
                <p className="text-2xl font-bold text-gray-900">45,231</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +18.7% este mês
                </p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gasto Total</p>
                <p className="text-2xl font-bold text-gray-900">R$ 27,640</p>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5.3% este mês
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Custo por Seguidor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Custo por Seguidor ao Longo do Tempo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'custoSeguidor' ? `R$ ${value}` : value,
                    name === 'custoSeguidor' ? 'Custo por Seguidor' : 'Seguidores'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="custoSeguidor" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Melhores Criativos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Melhores Criativos por Etapa do Funil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {Object.entries(melhoresCreativos).map(([tipo, criativos]) => (
              <div key={tipo} className="space-y-3">
                <h4 className={`text-sm font-semibold px-3 py-1 rounded-full border inline-block ${tiposCores[tipo]}`}>
                  {tipo} - {tipo === 'C1' ? 'Atrair Seguidores' : 'Nutrir Audiência'}
                </h4>
                <div className="space-y-2">
                  {criativos.map((criativo, index) => (
                    <div key={criativo.id} className="p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                        <span className={`text-xs px-2 py-1 rounded ${tiposCores[tipo]}`}>
                          {tipo}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        {criativo.identificador}
                      </p>
                      <div className="text-xs text-gray-600">
                        {tipo === 'C1' ? (
                          <>
                            <div>Custo/Seguidor: R$ {criativo.custoSeguidor}</div>
                            <div>Seguidores: {criativo.seguidores}</div>
                          </>
                        ) : (
                          <>
                            <div>Custo/Engajamento: R$ {criativo.custoEngajamento}</div>
                            <div>Engajamento: {criativo.engajamento}</div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


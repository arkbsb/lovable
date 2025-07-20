import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Megaphone,
  TrendingUp,
  DollarSign,
  Target,
  Play
} from 'lucide-react'

const tiposCampanha = [
  { value: 'C2', label: 'C2 - Nutrir (Consciência)', color: 'bg-blue-100 text-blue-800' },
  { value: 'C3', label: 'C3 - Nutrir (Consideração)', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'C4', label: 'C4 - Nutrir (Conversão)', color: 'bg-red-100 text-red-800' }
]

export function Campanhas() {
  const [campanhas, setCampanhas] = useState([])
  const [projetos, setProjetos] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editandoCampanha, setEditandoCampanha] = useState(null)
  const [filtros, setFiltros] = useState({
    projeto_id: '',
    tipo_campanha: ''
  })
  const [formData, setFormData] = useState({
    projeto_id: '',
    nome: '',
    tipo_campanha: '',
    objetivo: '',
    engajamento_total: '',
    custo_por_engajamento: '',
    alcance_total: '',
    thruplay_total: '',
    frequencia_media: '',
    valor_gasto_total: '',
    reproducao_25_pct_total: '',
    reproducao_50_pct_total: '',
    reproducao_75_pct_total: '',
    reproducao_95_pct_total: '',
    reproducao_100_pct_total: '',
    data_inicio: '',
    data_fim: ''
  })

  // Simular dados iniciais
  useEffect(() => {
    setProjetos([
      { id: '1', nome: 'Campanha Verão 2025' },
      { id: '2', nome: 'Lançamento Produto X' }
    ])
    
    setCampanhas([
      {
        id: '1',
        projeto_id: '1',
        nome: 'Nutrição de Leads - Webinars',
        tipo_campanha: 'C2',
        objetivo: 'Educar a audiência sobre os benefícios do produto através de webinars gratuitos',
        engajamento_total: 2500,
        custo_por_engajamento: 0.18,
        alcance_total: 45000,
        thruplay_total: 1200,
        valor_gasto_total: 450,
        data_inicio: '2025-01-15',
        data_fim: '2025-01-22'
      },
      {
        id: '2',
        projeto_id: '1',
        nome: 'Conversão - Oferta Limitada',
        tipo_campanha: 'C4',
        objetivo: 'Converter leads qualificados em clientes através de oferta especial',
        engajamento_total: 850,
        custo_por_engajamento: 0.35,
        alcance_total: 12000,
        valor_gasto_total: 298,
        data_inicio: '2025-01-20',
        data_fim: '2025-01-25'
      }
    ])
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const dadosProcessados = { ...formData }
      
      // Converter campos numéricos
      const camposNumericos = [
        'engajamento_total', 'custo_por_engajamento', 'alcance_total', 'thruplay_total',
        'frequencia_media', 'valor_gasto_total', 'reproducao_25_pct_total',
        'reproducao_50_pct_total', 'reproducao_75_pct_total', 'reproducao_95_pct_total',
        'reproducao_100_pct_total'
      ]
      
      camposNumericos.forEach(campo => {
        if (dadosProcessados[campo]) {
          dadosProcessados[campo] = parseFloat(dadosProcessados[campo]) || 0
        }
      })
      
      if (editandoCampanha) {
        // Atualizar campanha existente
        const campanhaAtualizada = {
          ...editandoCampanha,
          ...dadosProcessados
        }
        
        setCampanhas(campanhas.map(c => 
          c.id === editandoCampanha.id ? campanhaAtualizada : c
        ))
      } else {
        // Criar nova campanha
        const novaCampanha = {
          id: Date.now().toString(),
          ...dadosProcessados
        }
        
        setCampanhas([novaCampanha, ...campanhas])
      }
      
      resetForm()
      setDialogOpen(false)
    } catch (error) {
      console.error('Erro ao salvar campanha:', error)
    }
  }

  const handleEdit = (campanha) => {
    setEditandoCampanha(campanha)
    setFormData({
      projeto_id: campanha.projeto_id,
      nome: campanha.nome,
      tipo_campanha: campanha.tipo_campanha,
      objetivo: campanha.objetivo || '',
      engajamento_total: campanha.engajamento_total?.toString() || '',
      custo_por_engajamento: campanha.custo_por_engajamento?.toString() || '',
      alcance_total: campanha.alcance_total?.toString() || '',
      thruplay_total: campanha.thruplay_total?.toString() || '',
      frequencia_media: campanha.frequencia_media?.toString() || '',
      valor_gasto_total: campanha.valor_gasto_total?.toString() || '',
      reproducao_25_pct_total: campanha.reproducao_25_pct_total?.toString() || '',
      reproducao_50_pct_total: campanha.reproducao_50_pct_total?.toString() || '',
      reproducao_75_pct_total: campanha.reproducao_75_pct_total?.toString() || '',
      reproducao_95_pct_total: campanha.reproducao_95_pct_total?.toString() || '',
      reproducao_100_pct_total: campanha.reproducao_100_pct_total?.toString() || '',
      data_inicio: campanha.data_inicio || '',
      data_fim: campanha.data_fim || ''
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir esta campanha?')) {
      setCampanhas(campanhas.filter(c => c.id !== id))
    }
  }

  const resetForm = () => {
    setFormData({
      projeto_id: '',
      nome: '',
      tipo_campanha: '',
      objetivo: '',
      engajamento_total: '',
      custo_por_engajamento: '',
      alcance_total: '',
      thruplay_total: '',
      frequencia_media: '',
      valor_gasto_total: '',
      reproducao_25_pct_total: '',
      reproducao_50_pct_total: '',
      reproducao_75_pct_total: '',
      reproducao_95_pct_total: '',
      reproducao_100_pct_total: '',
      data_inicio: '',
      data_fim: ''
    })
    setEditandoCampanha(null)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getTipoCampanha = (tipo) => {
    return tiposCampanha.find(t => t.value === tipo)
  }

  const campanhasFiltradas = campanhas.filter(campanha => {
    if (filtros.projeto_id && campanha.projeto_id !== filtros.projeto_id) return false
    if (filtros.tipo_campanha && campanha.tipo_campanha !== filtros.tipo_campanha) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Campanhas</h2>
          <p className="text-gray-600 mt-1">Gerencie suas campanhas de nutrição (C2-C4)</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova Campanha
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editandoCampanha ? 'Editar Campanha' : 'Nova Campanha'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projeto_id">Projeto *</Label>
                  <Select value={formData.projeto_id} onValueChange={(value) => setFormData({...formData, projeto_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um projeto" />
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
                
                <div>
                  <Label htmlFor="tipo_campanha">Tipo de Campanha *</Label>
                  <Select value={formData.tipo_campanha} onValueChange={(value) => setFormData({...formData, tipo_campanha: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposCampanha.map(tipo => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="nome">Nome da Campanha *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Ex: Nutrição de Leads - Webinars"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="objetivo">Objetivo da Campanha</Label>
                <Textarea
                  id="objetivo"
                  value={formData.objetivo}
                  onChange={(e) => setFormData({...formData, objetivo: e.target.value})}
                  placeholder="Descreva o objetivo desta campanha"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="data_inicio">Data Início</Label>
                  <Input
                    id="data_inicio"
                    type="date"
                    value={formData.data_inicio}
                    onChange={(e) => setFormData({...formData, data_inicio: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="data_fim">Data Fim</Label>
                  <Input
                    id="data_fim"
                    type="date"
                    value={formData.data_fim}
                    onChange={(e) => setFormData({...formData, data_fim: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="alcance_total">Alcance Total</Label>
                  <Input
                    id="alcance_total"
                    type="number"
                    value={formData.alcance_total}
                    onChange={(e) => setFormData({...formData, alcance_total: e.target.value})}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="engajamento_total">Engajamento Total</Label>
                  <Input
                    id="engajamento_total"
                    type="number"
                    value={formData.engajamento_total}
                    onChange={(e) => setFormData({...formData, engajamento_total: e.target.value})}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="valor_gasto_total">Valor Gasto Total (R$)</Label>
                  <Input
                    id="valor_gasto_total"
                    type="number"
                    step="0.01"
                    value={formData.valor_gasto_total}
                    onChange={(e) => setFormData({...formData, valor_gasto_total: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="thruplay_total">ThruPlay Total</Label>
                  <Input
                    id="thruplay_total"
                    type="number"
                    value={formData.thruplay_total}
                    onChange={(e) => setFormData({...formData, thruplay_total: e.target.value})}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="frequencia_media">Frequência Média</Label>
                  <Input
                    id="frequencia_media"
                    type="number"
                    step="0.01"
                    value={formData.frequencia_media}
                    onChange={(e) => setFormData({...formData, frequencia_media: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="custo_por_engajamento">Custo por Engajamento (R$)</Label>
                  <Input
                    id="custo_por_engajamento"
                    type="number"
                    step="0.01"
                    value={formData.custo_por_engajamento}
                    onChange={(e) => setFormData({...formData, custo_por_engajamento: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="reproducao_25_pct_total">Reprodução 25%</Label>
                  <Input
                    id="reproducao_25_pct_total"
                    type="number"
                    value={formData.reproducao_25_pct_total}
                    onChange={(e) => setFormData({...formData, reproducao_25_pct_total: e.target.value})}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="reproducao_50_pct_total">Reprodução 50%</Label>
                  <Input
                    id="reproducao_50_pct_total"
                    type="number"
                    value={formData.reproducao_50_pct_total}
                    onChange={(e) => setFormData({...formData, reproducao_50_pct_total: e.target.value})}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="reproducao_75_pct_total">Reprodução 75%</Label>
                  <Input
                    id="reproducao_75_pct_total"
                    type="number"
                    value={formData.reproducao_75_pct_total}
                    onChange={(e) => setFormData({...formData, reproducao_75_pct_total: e.target.value})}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="reproducao_95_pct_total">Reprodução 95%</Label>
                  <Input
                    id="reproducao_95_pct_total"
                    type="number"
                    value={formData.reproducao_95_pct_total}
                    onChange={(e) => setFormData({...formData, reproducao_95_pct_total: e.target.value})}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="reproducao_100_pct_total">Reprodução 100%</Label>
                  <Input
                    id="reproducao_100_pct_total"
                    type="number"
                    value={formData.reproducao_100_pct_total}
                    onChange={(e) => setFormData({...formData, reproducao_100_pct_total: e.target.value})}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editandoCampanha ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="filtro_projeto">Filtrar por Projeto</Label>
              <Select value={filtros.projeto_id} onValueChange={(value) => setFiltros({...filtros, projeto_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os projetos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os projetos</SelectItem>
                  {projetos.map(projeto => (
                    <SelectItem key={projeto.id} value={projeto.id}>
                      {projeto.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <Label htmlFor="filtro_tipo">Filtrar por Tipo</Label>
              <Select value={filtros.tipo_campanha} onValueChange={(value) => setFiltros({...filtros, tipo_campanha: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  {tiposCampanha.map(tipo => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setFiltros({ projeto_id: '', tipo_campanha: '' })}
              className="mt-6"
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Campanhas */}
      {campanhasFiltradas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Megaphone className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma campanha encontrada</h3>
            <p className="text-gray-500 text-center mb-4">
              Comece criando sua primeira campanha de nutrição para acompanhar as métricas de engajamento.
            </p>
            <Button onClick={() => setDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Campanha
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {campanhasFiltradas.map((campanha) => {
            const tipoInfo = getTipoCampanha(campanha.tipo_campanha)
            const projeto = projetos.find(p => p.id === campanha.projeto_id)
            
            return (
              <Card key={campanha.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={tipoInfo?.color}>
                          {campanha.tipo_campanha}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {projeto?.nome}
                        </span>
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                        {campanha.nome}
                      </CardTitle>
                      {campanha.objetivo && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {campanha.objetivo}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-1 ml-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(campanha)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(campanha.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <Target className="w-3 h-3 mr-1" />
                          Alcance Total
                        </div>
                        <span className="font-semibold">
                          {campanha.alcance_total?.toLocaleString() || '-'}
                        </span>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Engajamento Total
                        </div>
                        <span className="font-semibold">
                          {campanha.engajamento_total?.toLocaleString() || '-'}
                        </span>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <DollarSign className="w-3 h-3 mr-1" />
                          Valor Gasto Total
                        </div>
                        <span className="font-semibold text-red-600">
                          {campanha.valor_gasto_total ? formatCurrency(campanha.valor_gasto_total) : '-'}
                        </span>
                      </div>
                      
                      <div>
                        <div className="text-gray-600 mb-1">Custo/Engajamento</div>
                        <span className="font-semibold text-green-600">
                          {campanha.custo_por_engajamento ? formatCurrency(campanha.custo_por_engajamento) : '-'}
                        </span>
                      </div>
                    </div>
                    
                    {campanha.thruplay_total && (
                      <div className="text-sm">
                        <div className="flex items-center text-gray-600 mb-1">
                          <Play className="w-3 h-3 mr-1" />
                          ThruPlay Total
                        </div>
                        <span className="font-semibold text-blue-600">
                          {campanha.thruplay_total.toLocaleString()}
                        </span>
                      </div>
                    )}
                    
                    <div className="pt-2 border-t border-gray-100 text-xs text-gray-500">
                      <div>Período: {formatDate(campanha.data_inicio)} - {formatDate(campanha.data_fim)}</div>
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          // Navegar para detalhes da campanha ou conteúdos associados
                          console.log('Ver detalhes da campanha:', campanha.id)
                        }}
                      >
                        Ver Conteúdos Associados
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}


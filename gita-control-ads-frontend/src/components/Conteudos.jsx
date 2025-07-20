import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText,
  Users,
  TrendingUp,
  DollarSign,
  Filter
} from 'lucide-react'

const tiposConteudo = [
  { value: 'C1', label: 'C1 - Atrair Seguidores', color: 'bg-green-100 text-green-800' },
  { value: 'C2', label: 'C2 - Nutrir (Consciência)', color: 'bg-blue-100 text-blue-800' },
  { value: 'C3', label: 'C3 - Nutrir (Consideração)', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'C4', label: 'C4 - Nutrir (Conversão)', color: 'bg-red-100 text-red-800' }
]

export function Conteudos() {
  const [conteudos, setConteudos] = useState([])
  const [projetos, setProjetos] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editandoConteudo, setEditandoConteudo] = useState(null)
  const [filtros, setFiltros] = useState({
    projeto_id: '',
    tipo_conteudo: ''
  })
  const [formData, setFormData] = useState({
    projeto_id: '',
    identificador: '',
    tipo_conteudo: '',
    alcance: '',
    engajamento: '',
    valor_gasto: '',
    cpm: '',
    seguidores_antes: '',
    seguidores_depois: '',
    thruplay: '',
    frequencia: '',
    reproducao_25_pct: '',
    reproducao_50_pct: '',
    reproducao_75_pct: '',
    reproducao_95_pct: '',
    reproducao_100_pct: '',
    data_inicio_impulsionamento: '',
    data_fim_impulsionamento: ''
  })

  // Simular dados iniciais
  useEffect(() => {
    setProjetos([
      { id: '1', nome: 'Campanha Verão 2025' },
      { id: '2', nome: 'Lançamento Produto X' }
    ])
    
    setConteudos([
      {
        id: '1',
        projeto_id: '1',
        identificador: 'Post Motivacional #1',
        tipo_conteudo: 'C1',
        alcance: 15000,
        engajamento: 1200,
        valor_gasto: 250,
        seguidores_antes: 5000,
        seguidores_depois: 5150,
        custo_por_seguidor: 1.67,
        data_inicio_impulsionamento: '2025-01-15',
        data_fim_impulsionamento: '2025-01-17'
      },
      {
        id: '2',
        projeto_id: '1',
        identificador: 'Webinar Gratuito',
        tipo_conteudo: 'C2',
        alcance: 8000,
        engajamento: 950,
        valor_gasto: 180,
        thruplay: 450,
        custo_por_engajamento: 0.19,
        data_inicio_impulsionamento: '2025-01-18',
        data_fim_impulsionamento: '2025-01-20'
      }
    ])
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const dadosProcessados = { ...formData }
      
      // Converter campos numéricos
      const camposNumericos = [
        'alcance', 'engajamento', 'valor_gasto', 'cpm', 'seguidores_antes', 
        'seguidores_depois', 'thruplay', 'frequencia', 'reproducao_25_pct',
        'reproducao_50_pct', 'reproducao_75_pct', 'reproducao_95_pct', 'reproducao_100_pct'
      ]
      
      camposNumericos.forEach(campo => {
        if (dadosProcessados[campo]) {
          dadosProcessados[campo] = parseFloat(dadosProcessados[campo]) || 0
        }
      })
      
      if (editandoConteudo) {
        // Atualizar conteúdo existente
        const conteudoAtualizado = {
          ...editandoConteudo,
          ...dadosProcessados
        }
        
        setConteudos(conteudos.map(c => 
          c.id === editandoConteudo.id ? conteudoAtualizado : c
        ))
      } else {
        // Criar novo conteúdo
        const novoConteudo = {
          id: Date.now().toString(),
          ...dadosProcessados
        }
        
        setConteudos([novoConteudo, ...conteudos])
      }
      
      resetForm()
      setDialogOpen(false)
    } catch (error) {
      console.error('Erro ao salvar conteúdo:', error)
    }
  }

  const handleEdit = (conteudo) => {
    setEditandoConteudo(conteudo)
    setFormData({
      projeto_id: conteudo.projeto_id,
      identificador: conteudo.identificador,
      tipo_conteudo: conteudo.tipo_conteudo,
      alcance: conteudo.alcance?.toString() || '',
      engajamento: conteudo.engajamento?.toString() || '',
      valor_gasto: conteudo.valor_gasto?.toString() || '',
      cpm: conteudo.cpm?.toString() || '',
      seguidores_antes: conteudo.seguidores_antes?.toString() || '',
      seguidores_depois: conteudo.seguidores_depois?.toString() || '',
      thruplay: conteudo.thruplay?.toString() || '',
      frequencia: conteudo.frequencia?.toString() || '',
      reproducao_25_pct: conteudo.reproducao_25_pct?.toString() || '',
      reproducao_50_pct: conteudo.reproducao_50_pct?.toString() || '',
      reproducao_75_pct: conteudo.reproducao_75_pct?.toString() || '',
      reproducao_95_pct: conteudo.reproducao_95_pct?.toString() || '',
      reproducao_100_pct: conteudo.reproducao_100_pct?.toString() || '',
      data_inicio_impulsionamento: conteudo.data_inicio_impulsionamento || '',
      data_fim_impulsionamento: conteudo.data_fim_impulsionamento || ''
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este conteúdo?')) {
      setConteudos(conteudos.filter(c => c.id !== id))
    }
  }

  const resetForm = () => {
    setFormData({
      projeto_id: '',
      identificador: '',
      tipo_conteudo: '',
      alcance: '',
      engajamento: '',
      valor_gasto: '',
      cpm: '',
      seguidores_antes: '',
      seguidores_depois: '',
      thruplay: '',
      frequencia: '',
      reproducao_25_pct: '',
      reproducao_50_pct: '',
      reproducao_75_pct: '',
      reproducao_95_pct: '',
      reproducao_100_pct: '',
      data_inicio_impulsionamento: '',
      data_fim_impulsionamento: ''
    })
    setEditandoConteudo(null)
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

  const getTipoConteudo = (tipo) => {
    return tiposConteudo.find(t => t.value === tipo)
  }

  const conteudosFiltrados = conteudos.filter(conteudo => {
    if (filtros.projeto_id && conteudo.projeto_id !== filtros.projeto_id) return false
    if (filtros.tipo_conteudo && conteudo.tipo_conteudo !== filtros.tipo_conteudo) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Conteúdos</h2>
          <p className="text-gray-600 mt-1">Gerencie seus conteúdos e métricas de performance</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Conteúdo
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editandoConteudo ? 'Editar Conteúdo' : 'Novo Conteúdo'}
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
                  <Label htmlFor="tipo_conteudo">Tipo de Conteúdo *</Label>
                  <Select value={formData.tipo_conteudo} onValueChange={(value) => setFormData({...formData, tipo_conteudo: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposConteudo.map(tipo => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="identificador">Identificador do Conteúdo *</Label>
                <Input
                  id="identificador"
                  value={formData.identificador}
                  onChange={(e) => setFormData({...formData, identificador: e.target.value})}
                  placeholder="Ex: Post Motivacional #1"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="data_inicio_impulsionamento">Data Início</Label>
                  <Input
                    id="data_inicio_impulsionamento"
                    type="date"
                    value={formData.data_inicio_impulsionamento}
                    onChange={(e) => setFormData({...formData, data_inicio_impulsionamento: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="data_fim_impulsionamento">Data Fim</Label>
                  <Input
                    id="data_fim_impulsionamento"
                    type="date"
                    value={formData.data_fim_impulsionamento}
                    onChange={(e) => setFormData({...formData, data_fim_impulsionamento: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="alcance">Alcance</Label>
                  <Input
                    id="alcance"
                    type="number"
                    value={formData.alcance}
                    onChange={(e) => setFormData({...formData, alcance: e.target.value})}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="engajamento">Engajamento</Label>
                  <Input
                    id="engajamento"
                    type="number"
                    value={formData.engajamento}
                    onChange={(e) => setFormData({...formData, engajamento: e.target.value})}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="valor_gasto">Valor Gasto (R$)</Label>
                  <Input
                    id="valor_gasto"
                    type="number"
                    step="0.01"
                    value={formData.valor_gasto}
                    onChange={(e) => setFormData({...formData, valor_gasto: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              {formData.tipo_conteudo === 'C1' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="seguidores_antes">Seguidores Antes</Label>
                    <Input
                      id="seguidores_antes"
                      type="number"
                      value={formData.seguidores_antes}
                      onChange={(e) => setFormData({...formData, seguidores_antes: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="seguidores_depois">Seguidores Depois</Label>
                    <Input
                      id="seguidores_depois"
                      type="number"
                      value={formData.seguidores_depois}
                      onChange={(e) => setFormData({...formData, seguidores_depois: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                </div>
              )}
              
              {['C2', 'C3', 'C4'].includes(formData.tipo_conteudo) && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="thruplay">ThruPlay</Label>
                      <Input
                        id="thruplay"
                        type="number"
                        value={formData.thruplay}
                        onChange={(e) => setFormData({...formData, thruplay: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="frequencia">Frequência</Label>
                      <Input
                        id="frequencia"
                        type="number"
                        step="0.01"
                        value={formData.frequencia}
                        onChange={(e) => setFormData({...formData, frequencia: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cpm">CPM (R$)</Label>
                      <Input
                        id="cpm"
                        type="number"
                        step="0.01"
                        value={formData.cpm}
                        onChange={(e) => setFormData({...formData, cpm: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-4">
                    <div>
                      <Label htmlFor="reproducao_25_pct">Reprodução 25%</Label>
                      <Input
                        id="reproducao_25_pct"
                        type="number"
                        value={formData.reproducao_25_pct}
                        onChange={(e) => setFormData({...formData, reproducao_25_pct: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="reproducao_50_pct">Reprodução 50%</Label>
                      <Input
                        id="reproducao_50_pct"
                        type="number"
                        value={formData.reproducao_50_pct}
                        onChange={(e) => setFormData({...formData, reproducao_50_pct: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="reproducao_75_pct">Reprodução 75%</Label>
                      <Input
                        id="reproducao_75_pct"
                        type="number"
                        value={formData.reproducao_75_pct}
                        onChange={(e) => setFormData({...formData, reproducao_75_pct: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="reproducao_95_pct">Reprodução 95%</Label>
                      <Input
                        id="reproducao_95_pct"
                        type="number"
                        value={formData.reproducao_95_pct}
                        onChange={(e) => setFormData({...formData, reproducao_95_pct: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="reproducao_100_pct">Reprodução 100%</Label>
                      <Input
                        id="reproducao_100_pct"
                        type="number"
                        value={formData.reproducao_100_pct}
                        onChange={(e) => setFormData({...formData, reproducao_100_pct: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editandoConteudo ? 'Atualizar' : 'Criar'}
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
              <Select value={filtros.tipo_conteudo} onValueChange={(value) => setFiltros({...filtros, tipo_conteudo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  {tiposConteudo.map(tipo => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setFiltros({ projeto_id: '', tipo_conteudo: '' })}
              className="mt-6"
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Conteúdos */}
      {conteudosFiltrados.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum conteúdo encontrado</h3>
            <p className="text-gray-500 text-center mb-4">
              Comece criando seu primeiro conteúdo para acompanhar as métricas de performance.
            </p>
            <Button onClick={() => setDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Conteúdo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {conteudosFiltrados.map((conteudo) => {
            const tipoInfo = getTipoConteudo(conteudo.tipo_conteudo)
            const projeto = projetos.find(p => p.id === conteudo.projeto_id)
            
            return (
              <Card key={conteudo.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={tipoInfo?.color}>
                          {conteudo.tipo_conteudo}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {projeto?.nome}
                        </span>
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {conteudo.identificador}
                      </CardTitle>
                    </div>
                    <div className="flex space-x-1 ml-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(conteudo)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(conteudo.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <Users className="w-3 h-3 mr-1" />
                          Alcance
                        </div>
                        <span className="font-semibold">
                          {conteudo.alcance?.toLocaleString() || '-'}
                        </span>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Engajamento
                        </div>
                        <span className="font-semibold">
                          {conteudo.engajamento?.toLocaleString() || '-'}
                        </span>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <DollarSign className="w-3 h-3 mr-1" />
                          Valor Gasto
                        </div>
                        <span className="font-semibold text-red-600">
                          {conteudo.valor_gasto ? formatCurrency(conteudo.valor_gasto) : '-'}
                        </span>
                      </div>
                      
                      <div>
                        <div className="text-gray-600 mb-1">
                          {conteudo.tipo_conteudo === 'C1' ? 'Custo/Seguidor' : 'Custo/Engajamento'}
                        </div>
                        <span className="font-semibold text-green-600">
                          {conteudo.tipo_conteudo === 'C1' 
                            ? (conteudo.custo_por_seguidor ? formatCurrency(conteudo.custo_por_seguidor) : '-')
                            : (conteudo.custo_por_engajamento ? formatCurrency(conteudo.custo_por_engajamento) : '-')
                          }
                        </span>
                      </div>
                    </div>
                    
                    {conteudo.tipo_conteudo === 'C1' && (
                      <div className="text-sm">
                        <div className="text-gray-600 mb-1">Seguidores Ganhos</div>
                        <span className="font-semibold text-blue-600">
                          {conteudo.seguidores_antes && conteudo.seguidores_depois 
                            ? `+${(conteudo.seguidores_depois - conteudo.seguidores_antes).toLocaleString()}`
                            : '-'
                          }
                        </span>
                      </div>
                    )}
                    
                    <div className="pt-2 border-t border-gray-100 text-xs text-gray-500">
                      <div>Período: {formatDate(conteudo.data_inicio_impulsionamento)} - {formatDate(conteudo.data_fim_impulsionamento)}</div>
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


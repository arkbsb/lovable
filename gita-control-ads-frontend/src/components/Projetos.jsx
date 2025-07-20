import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  Edit, 
  Trash2, 
  FolderOpen,
  DollarSign,
  Calendar
} from 'lucide-react'

export function Projetos() {
  const [projetos, setProjetos] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editandoProjeto, setEditandoProjeto] = useState(null)
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    projecao_gasto_mensal: ''
  })

  // Simular dados iniciais
  useEffect(() => {
    setProjetos([
      {
        id: '1',
        nome: 'Campanha Verão 2025',
        descricao: 'Campanha focada em produtos de verão e lifestyle',
        projecao_gasto_mensal: 5000,
        data_criacao: '2025-01-15T10:00:00Z'
      },
      {
        id: '2',
        nome: 'Lançamento Produto X',
        descricao: 'Estratégia de lançamento do novo produto da linha premium',
        projecao_gasto_mensal: 8000,
        data_criacao: '2025-01-10T14:30:00Z'
      }
    ])
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editandoProjeto) {
        // Atualizar projeto existente
        const projetoAtualizado = {
          ...editandoProjeto,
          ...formData,
          projecao_gasto_mensal: parseFloat(formData.projecao_gasto_mensal) || 0
        }
        
        setProjetos(projetos.map(p => 
          p.id === editandoProjeto.id ? projetoAtualizado : p
        ))
      } else {
        // Criar novo projeto
        const novoProjeto = {
          id: Date.now().toString(),
          ...formData,
          projecao_gasto_mensal: parseFloat(formData.projecao_gasto_mensal) || 0,
          data_criacao: new Date().toISOString()
        }
        
        setProjetos([novoProjeto, ...projetos])
      }
      
      resetForm()
      setDialogOpen(false)
    } catch (error) {
      console.error('Erro ao salvar projeto:', error)
    }
  }

  const handleEdit = (projeto) => {
    setEditandoProjeto(projeto)
    setFormData({
      nome: projeto.nome,
      descricao: projeto.descricao,
      projecao_gasto_mensal: projeto.projecao_gasto_mensal.toString()
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      setProjetos(projetos.filter(p => p.id !== id))
    }
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      projecao_gasto_mensal: ''
    })
    setEditandoProjeto(null)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Projetos</h2>
          <p className="text-gray-600 mt-1">Gerencie seus projetos de Meta Ads</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Projeto
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editandoProjeto ? 'Editar Projeto' : 'Novo Projeto'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome do Projeto *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Digite o nome do projeto"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Descreva o objetivo do projeto"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="projecao_gasto_mensal">Projeção de Gasto Mensal (R$)</Label>
                <Input
                  id="projecao_gasto_mensal"
                  type="number"
                  step="0.01"
                  value={formData.projecao_gasto_mensal}
                  onChange={(e) => setFormData({...formData, projecao_gasto_mensal: e.target.value})}
                  placeholder="0.00"
                />
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
                  {editandoProjeto ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Projetos */}
      {projetos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum projeto encontrado</h3>
            <p className="text-gray-500 text-center mb-4">
              Comece criando seu primeiro projeto para organizar suas campanhas de Meta Ads.
            </p>
            <Button onClick={() => setDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Projeto
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projetos.map((projeto) => (
            <Card key={projeto.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                      {projeto.nome}
                    </CardTitle>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {projeto.descricao || 'Sem descrição'}
                    </p>
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(projeto)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(projeto.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Projeção Mensal
                    </div>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(projeto.projecao_gasto_mensal)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      Criado em
                    </div>
                    <span className="text-sm text-gray-900">
                      {formatDate(projeto.data_criacao)}
                    </span>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        // Navegar para detalhes do projeto ou conteúdos
                        console.log('Ver detalhes do projeto:', projeto.id)
                      }}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


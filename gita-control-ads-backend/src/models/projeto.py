from datetime import datetime
from typing import Optional, List, Dict, Any
from src.config.supabase_config import supabase

class Projeto:
    def __init__(self, id: str = None, nome: str = None, descricao: str = None, 
                 projecao_gasto_mensal: float = None, data_criacao: datetime = None,
                 data_atualizacao: datetime = None, ativo: bool = True):
        self.id = id
        self.nome = nome
        self.descricao = descricao
        self.projecao_gasto_mensal = projecao_gasto_mensal
        self.data_criacao = data_criacao
        self.data_atualizacao = data_atualizacao
        self.ativo = ativo

    @classmethod
    def criar(cls, nome: str, descricao: str = None, projecao_gasto_mensal: float = None) -> 'Projeto':
        """Cria um novo projeto no Supabase"""
        try:
            data = {
                'nome': nome,
                'descricao': descricao,
                'projecao_gasto_mensal': projecao_gasto_mensal,
                'ativo': True
            }
            
            response = supabase.table('projetos').insert(data).execute()
            
            if response.data:
                projeto_data = response.data[0]
                return cls(
                    id=projeto_data['id'],
                    nome=projeto_data['nome'],
                    descricao=projeto_data['descricao'],
                    projecao_gasto_mensal=projeto_data['projecao_gasto_mensal'],
                    data_criacao=projeto_data['data_criacao'],
                    data_atualizacao=projeto_data['data_atualizacao'],
                    ativo=projeto_data['ativo']
                )
            return None
        except Exception as e:
            print(f"Erro ao criar projeto: {e}")
            return None

    @classmethod
    def buscar_por_id(cls, projeto_id: str) -> Optional['Projeto']:
        """Busca um projeto pelo ID"""
        try:
            response = supabase.table('projetos').select('*').eq('id', projeto_id).eq('ativo', True).execute()
            
            if response.data:
                projeto_data = response.data[0]
                return cls(
                    id=projeto_data['id'],
                    nome=projeto_data['nome'],
                    descricao=projeto_data['descricao'],
                    projecao_gasto_mensal=projeto_data['projecao_gasto_mensal'],
                    data_criacao=projeto_data['data_criacao'],
                    data_atualizacao=projeto_data['data_atualizacao'],
                    ativo=projeto_data['ativo']
                )
            return None
        except Exception as e:
            print(f"Erro ao buscar projeto: {e}")
            return None

    @classmethod
    def listar_todos(cls) -> List['Projeto']:
        """Lista todos os projetos ativos"""
        try:
            response = supabase.table('projetos').select('*').eq('ativo', True).order('data_criacao', desc=True).execute()
            
            projetos = []
            for projeto_data in response.data:
                projetos.append(cls(
                    id=projeto_data['id'],
                    nome=projeto_data['nome'],
                    descricao=projeto_data['descricao'],
                    projecao_gasto_mensal=projeto_data['projecao_gasto_mensal'],
                    data_criacao=projeto_data['data_criacao'],
                    data_atualizacao=projeto_data['data_atualizacao'],
                    ativo=projeto_data['ativo']
                ))
            return projetos
        except Exception as e:
            print(f"Erro ao listar projetos: {e}")
            return []

    def atualizar(self, nome: str = None, descricao: str = None, projecao_gasto_mensal: float = None) -> bool:
        """Atualiza os dados do projeto"""
        try:
            data = {}
            if nome is not None:
                data['nome'] = nome
                self.nome = nome
            if descricao is not None:
                data['descricao'] = descricao
                self.descricao = descricao
            if projecao_gasto_mensal is not None:
                data['projecao_gasto_mensal'] = projecao_gasto_mensal
                self.projecao_gasto_mensal = projecao_gasto_mensal
            
            if data:
                response = supabase.table('projetos').update(data).eq('id', self.id).execute()
                return len(response.data) > 0
            return True
        except Exception as e:
            print(f"Erro ao atualizar projeto: {e}")
            return False

    def deletar(self) -> bool:
        """Marca o projeto como inativo (soft delete)"""
        try:
            response = supabase.table('projetos').update({'ativo': False}).eq('id', self.id).execute()
            if len(response.data) > 0:
                self.ativo = False
                return True
            return False
        except Exception as e:
            print(f"Erro ao deletar projeto: {e}")
            return False

    def to_dict(self) -> Dict[str, Any]:
        """Converte o projeto para dicionário"""
        return {
            'id': self.id,
            'nome': self.nome,
            'descricao': self.descricao,
            'projecao_gasto_mensal': self.projecao_gasto_mensal,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'data_atualizacao': self.data_atualizacao.isoformat() if self.data_atualizacao else None,
            'ativo': self.ativo
        }


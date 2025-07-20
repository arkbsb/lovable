from datetime import datetime, date
from typing import Optional, List, Dict, Any
from src.config.supabase_config import supabase

class Campanha:
    def __init__(self, id: str = None, projeto_id: str = None, nome: str = None,
                 tipo_campanha: str = None, objetivo: str = None, engajamento_total: int = None,
                 custo_por_engajamento: float = None, alcance_total: int = None,
                 thruplay_total: int = None, frequencia_media: float = None,
                 valor_gasto_total: float = None, reproducao_25_pct_total: int = None,
                 reproducao_50_pct_total: int = None, reproducao_75_pct_total: int = None,
                 reproducao_95_pct_total: int = None, reproducao_100_pct_total: int = None,
                 data_inicio: date = None, data_fim: date = None,
                 data_criacao: datetime = None, data_atualizacao: datetime = None,
                 ativo: bool = True):
        self.id = id
        self.projeto_id = projeto_id
        self.nome = nome
        self.tipo_campanha = tipo_campanha
        self.objetivo = objetivo
        self.engajamento_total = engajamento_total
        self.custo_por_engajamento = custo_por_engajamento
        self.alcance_total = alcance_total
        self.thruplay_total = thruplay_total
        self.frequencia_media = frequencia_media
        self.valor_gasto_total = valor_gasto_total
        self.reproducao_25_pct_total = reproducao_25_pct_total
        self.reproducao_50_pct_total = reproducao_50_pct_total
        self.reproducao_75_pct_total = reproducao_75_pct_total
        self.reproducao_95_pct_total = reproducao_95_pct_total
        self.reproducao_100_pct_total = reproducao_100_pct_total
        self.data_inicio = data_inicio
        self.data_fim = data_fim
        self.data_criacao = data_criacao
        self.data_atualizacao = data_atualizacao
        self.ativo = ativo

    @classmethod
    def criar(cls, projeto_id: str, nome: str, tipo_campanha: str, objetivo: str = None, **kwargs) -> 'Campanha':
        """Cria uma nova campanha no Supabase"""
        try:
            data = {
                'projeto_id': projeto_id,
                'nome': nome,
                'tipo_campanha': tipo_campanha,
                'objetivo': objetivo,
                'ativo': True
            }
            
            # Adiciona campos opcionais
            campos_opcionais = [
                'engajamento_total', 'custo_por_engajamento', 'alcance_total',
                'thruplay_total', 'frequencia_media', 'valor_gasto_total',
                'reproducao_25_pct_total', 'reproducao_50_pct_total',
                'reproducao_75_pct_total', 'reproducao_95_pct_total',
                'reproducao_100_pct_total', 'data_inicio', 'data_fim'
            ]
            
            for campo in campos_opcionais:
                if campo in kwargs and kwargs[campo] is not None:
                    data[campo] = kwargs[campo]
            
            response = supabase.table('campanhas').insert(data).execute()
            
            if response.data:
                campanha_data = response.data[0]
                return cls._from_dict(campanha_data)
            return None
        except Exception as e:
            print(f"Erro ao criar campanha: {e}")
            return None

    @classmethod
    def buscar_por_id(cls, campanha_id: str) -> Optional['Campanha']:
        """Busca uma campanha pelo ID"""
        try:
            response = supabase.table('campanhas').select('*').eq('id', campanha_id).eq('ativo', True).execute()
            
            if response.data:
                return cls._from_dict(response.data[0])
            return None
        except Exception as e:
            print(f"Erro ao buscar campanha: {e}")
            return None

    @classmethod
    def listar_por_projeto(cls, projeto_id: str, tipo_campanha: str = None) -> List['Campanha']:
        """Lista campanhas por projeto, opcionalmente filtrado por tipo"""
        try:
            query = supabase.table('campanhas').select('*').eq('projeto_id', projeto_id).eq('ativo', True)
            
            if tipo_campanha:
                query = query.eq('tipo_campanha', tipo_campanha)
            
            response = query.order('data_criacao', desc=True).execute()
            
            campanhas = []
            for campanha_data in response.data:
                campanhas.append(cls._from_dict(campanha_data))
            return campanhas
        except Exception as e:
            print(f"Erro ao listar campanhas: {e}")
            return []

    def associar_conteudo(self, conteudo_id: str) -> bool:
        """Associa um conteúdo à campanha"""
        try:
            data = {
                'campanha_id': self.id,
                'conteudo_id': conteudo_id
            }
            
            response = supabase.table('campanha_conteudos').insert(data).execute()
            return len(response.data) > 0
        except Exception as e:
            print(f"Erro ao associar conteúdo à campanha: {e}")
            return False

    def desassociar_conteudo(self, conteudo_id: str) -> bool:
        """Remove a associação de um conteúdo da campanha"""
        try:
            response = supabase.table('campanha_conteudos').delete().eq('campanha_id', self.id).eq('conteudo_id', conteudo_id).execute()
            return len(response.data) > 0
        except Exception as e:
            print(f"Erro ao desassociar conteúdo da campanha: {e}")
            return False

    def listar_conteudos(self) -> List[Dict[str, Any]]:
        """Lista todos os conteúdos associados à campanha"""
        try:
            response = supabase.table('campanha_conteudos').select('''
                conteudo_id,
                conteudos (
                    id,
                    identificador,
                    tipo_conteudo,
                    alcance,
                    engajamento,
                    valor_gasto,
                    custo_por_engajamento
                )
            ''').eq('campanha_id', self.id).execute()
            
            conteudos = []
            for item in response.data:
                if item['conteudos']:
                    conteudos.append(item['conteudos'])
            return conteudos
        except Exception as e:
            print(f"Erro ao listar conteúdos da campanha: {e}")
            return []

    def atualizar(self, **kwargs) -> bool:
        """Atualiza os dados da campanha"""
        try:
            data = {}
            campos_atualizaveis = [
                'nome', 'tipo_campanha', 'objetivo', 'engajamento_total',
                'custo_por_engajamento', 'alcance_total', 'thruplay_total',
                'frequencia_media', 'valor_gasto_total', 'reproducao_25_pct_total',
                'reproducao_50_pct_total', 'reproducao_75_pct_total',
                'reproducao_95_pct_total', 'reproducao_100_pct_total',
                'data_inicio', 'data_fim'
            ]
            
            for campo in campos_atualizaveis:
                if campo in kwargs and kwargs[campo] is not None:
                    data[campo] = kwargs[campo]
                    setattr(self, campo, kwargs[campo])
            
            if data:
                response = supabase.table('campanhas').update(data).eq('id', self.id).execute()
                return len(response.data) > 0
            return True
        except Exception as e:
            print(f"Erro ao atualizar campanha: {e}")
            return False

    def deletar(self) -> bool:
        """Marca a campanha como inativa (soft delete)"""
        try:
            response = supabase.table('campanhas').update({'ativo': False}).eq('id', self.id).execute()
            if len(response.data) > 0:
                self.ativo = False
                return True
            return False
        except Exception as e:
            print(f"Erro ao deletar campanha: {e}")
            return False

    @classmethod
    def _from_dict(cls, data: Dict[str, Any]) -> 'Campanha':
        """Cria uma instância de Campanha a partir de um dicionário"""
        return cls(
            id=data.get('id'),
            projeto_id=data.get('projeto_id'),
            nome=data.get('nome'),
            tipo_campanha=data.get('tipo_campanha'),
            objetivo=data.get('objetivo'),
            engajamento_total=data.get('engajamento_total'),
            custo_por_engajamento=data.get('custo_por_engajamento'),
            alcance_total=data.get('alcance_total'),
            thruplay_total=data.get('thruplay_total'),
            frequencia_media=data.get('frequencia_media'),
            valor_gasto_total=data.get('valor_gasto_total'),
            reproducao_25_pct_total=data.get('reproducao_25_pct_total'),
            reproducao_50_pct_total=data.get('reproducao_50_pct_total'),
            reproducao_75_pct_total=data.get('reproducao_75_pct_total'),
            reproducao_95_pct_total=data.get('reproducao_95_pct_total'),
            reproducao_100_pct_total=data.get('reproducao_100_pct_total'),
            data_inicio=data.get('data_inicio'),
            data_fim=data.get('data_fim'),
            data_criacao=data.get('data_criacao'),
            data_atualizacao=data.get('data_atualizacao'),
            ativo=data.get('ativo', True)
        )

    def to_dict(self) -> Dict[str, Any]:
        """Converte a campanha para dicionário"""
        return {
            'id': self.id,
            'projeto_id': self.projeto_id,
            'nome': self.nome,
            'tipo_campanha': self.tipo_campanha,
            'objetivo': self.objetivo,
            'engajamento_total': self.engajamento_total,
            'custo_por_engajamento': self.custo_por_engajamento,
            'alcance_total': self.alcance_total,
            'thruplay_total': self.thruplay_total,
            'frequencia_media': self.frequencia_media,
            'valor_gasto_total': self.valor_gasto_total,
            'reproducao_25_pct_total': self.reproducao_25_pct_total,
            'reproducao_50_pct_total': self.reproducao_50_pct_total,
            'reproducao_75_pct_total': self.reproducao_75_pct_total,
            'reproducao_95_pct_total': self.reproducao_95_pct_total,
            'reproducao_100_pct_total': self.reproducao_100_pct_total,
            'data_inicio': self.data_inicio.isoformat() if self.data_inicio else None,
            'data_fim': self.data_fim.isoformat() if self.data_fim else None,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'data_atualizacao': self.data_atualizacao.isoformat() if self.data_atualizacao else None,
            'ativo': self.ativo
        }


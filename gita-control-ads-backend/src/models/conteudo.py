from datetime import datetime, date
from typing import Optional, List, Dict, Any
from src.config.supabase_config import supabase

class Conteudo:
    def __init__(self, id: str = None, projeto_id: str = None, identificador: str = None,
                 tipo_conteudo: str = None, alcance: int = None, engajamento: int = None,
                 valor_gasto: float = None, cpm: float = None, seguidores_antes: int = None,
                 seguidores_depois: int = None, custo_por_seguidor: float = None,
                 custo_por_engajamento: float = None, thruplay: int = None,
                 frequencia: float = None, reproducao_25_pct: int = None,
                 reproducao_50_pct: int = None, reproducao_75_pct: int = None,
                 reproducao_95_pct: int = None, reproducao_100_pct: int = None,
                 data_inicio_impulsionamento: date = None, data_fim_impulsionamento: date = None,
                 data_criacao: datetime = None, data_atualizacao: datetime = None,
                 ativo: bool = True):
        self.id = id
        self.projeto_id = projeto_id
        self.identificador = identificador
        self.tipo_conteudo = tipo_conteudo
        self.alcance = alcance
        self.engajamento = engajamento
        self.valor_gasto = valor_gasto
        self.cpm = cpm
        self.seguidores_antes = seguidores_antes
        self.seguidores_depois = seguidores_depois
        self.custo_por_seguidor = custo_por_seguidor
        self.custo_por_engajamento = custo_por_engajamento
        self.thruplay = thruplay
        self.frequencia = frequencia
        self.reproducao_25_pct = reproducao_25_pct
        self.reproducao_50_pct = reproducao_50_pct
        self.reproducao_75_pct = reproducao_75_pct
        self.reproducao_95_pct = reproducao_95_pct
        self.reproducao_100_pct = reproducao_100_pct
        self.data_inicio_impulsionamento = data_inicio_impulsionamento
        self.data_fim_impulsionamento = data_fim_impulsionamento
        self.data_criacao = data_criacao
        self.data_atualizacao = data_atualizacao
        self.ativo = ativo

    @classmethod
    def criar(cls, projeto_id: str, identificador: str, tipo_conteudo: str, **kwargs) -> 'Conteudo':
        """Cria um novo conteúdo no Supabase"""
        try:
            data = {
                'projeto_id': projeto_id,
                'identificador': identificador,
                'tipo_conteudo': tipo_conteudo,
                'ativo': True
            }
            
            # Adiciona campos opcionais
            campos_opcionais = [
                'alcance', 'engajamento', 'valor_gasto', 'cpm', 'seguidores_antes',
                'seguidores_depois', 'thruplay', 'frequencia', 'reproducao_25_pct',
                'reproducao_50_pct', 'reproducao_75_pct', 'reproducao_95_pct',
                'reproducao_100_pct', 'data_inicio_impulsionamento', 'data_fim_impulsionamento'
            ]
            
            for campo in campos_opcionais:
                if campo in kwargs and kwargs[campo] is not None:
                    data[campo] = kwargs[campo]
            
            response = supabase.table('conteudos').insert(data).execute()
            
            if response.data:
                conteudo_data = response.data[0]
                return cls._from_dict(conteudo_data)
            return None
        except Exception as e:
            print(f"Erro ao criar conteúdo: {e}")
            return None

    @classmethod
    def buscar_por_id(cls, conteudo_id: str) -> Optional['Conteudo']:
        """Busca um conteúdo pelo ID"""
        try:
            response = supabase.table('conteudos').select('*').eq('id', conteudo_id).eq('ativo', True).execute()
            
            if response.data:
                return cls._from_dict(response.data[0])
            return None
        except Exception as e:
            print(f"Erro ao buscar conteúdo: {e}")
            return None

    @classmethod
    def listar_por_projeto(cls, projeto_id: str, tipo_conteudo: str = None) -> List['Conteudo']:
        """Lista conteúdos por projeto, opcionalmente filtrado por tipo"""
        try:
            query = supabase.table('conteudos').select('*').eq('projeto_id', projeto_id).eq('ativo', True)
            
            if tipo_conteudo:
                query = query.eq('tipo_conteudo', tipo_conteudo)
            
            response = query.order('data_criacao', desc=True).execute()
            
            conteudos = []
            for conteudo_data in response.data:
                conteudos.append(cls._from_dict(conteudo_data))
            return conteudos
        except Exception as e:
            print(f"Erro ao listar conteúdos: {e}")
            return []

    @classmethod
    def listar_melhores_criativos(cls, data_inicio: date = None, data_fim: date = None) -> Dict[str, List['Conteudo']]:
        """Lista os melhores criativos por tipo de conteúdo"""
        try:
            query = supabase.table('conteudos').select('*').eq('ativo', True)
            
            if data_inicio:
                query = query.gte('data_inicio_impulsionamento', data_inicio.isoformat())
            if data_fim:
                query = query.lte('data_fim_impulsionamento', data_fim.isoformat())
            
            response = query.execute()
            
            melhores_por_tipo = {'C1': [], 'C2': [], 'C3': [], 'C4': []}
            
            for conteudo_data in response.data:
                conteudo = cls._from_dict(conteudo_data)
                tipo = conteudo.tipo_conteudo
                
                if tipo in melhores_por_tipo:
                    melhores_por_tipo[tipo].append(conteudo)
            
            # Ordena por performance (C1 por custo por seguidor, C2-C4 por custo por engajamento)
            for tipo in melhores_por_tipo:
                if tipo == 'C1':
                    melhores_por_tipo[tipo].sort(key=lambda x: x.custo_por_seguidor or float('inf'))
                else:
                    melhores_por_tipo[tipo].sort(key=lambda x: x.custo_por_engajamento or float('inf'))
                
                # Mantém apenas os top 10
                melhores_por_tipo[tipo] = melhores_por_tipo[tipo][:10]
            
            return melhores_por_tipo
        except Exception as e:
            print(f"Erro ao buscar melhores criativos: {e}")
            return {'C1': [], 'C2': [], 'C3': [], 'C4': []}

    def atualizar(self, **kwargs) -> bool:
        """Atualiza os dados do conteúdo"""
        try:
            data = {}
            campos_atualizaveis = [
                'identificador', 'tipo_conteudo', 'alcance', 'engajamento', 'valor_gasto',
                'cpm', 'seguidores_antes', 'seguidores_depois', 'thruplay', 'frequencia',
                'reproducao_25_pct', 'reproducao_50_pct', 'reproducao_75_pct',
                'reproducao_95_pct', 'reproducao_100_pct', 'data_inicio_impulsionamento',
                'data_fim_impulsionamento'
            ]
            
            for campo in campos_atualizaveis:
                if campo in kwargs and kwargs[campo] is not None:
                    data[campo] = kwargs[campo]
                    setattr(self, campo, kwargs[campo])
            
            if data:
                response = supabase.table('conteudos').update(data).eq('id', self.id).execute()
                return len(response.data) > 0
            return True
        except Exception as e:
            print(f"Erro ao atualizar conteúdo: {e}")
            return False

    def deletar(self) -> bool:
        """Marca o conteúdo como inativo (soft delete)"""
        try:
            response = supabase.table('conteudos').update({'ativo': False}).eq('id', self.id).execute()
            if len(response.data) > 0:
                self.ativo = False
                return True
            return False
        except Exception as e:
            print(f"Erro ao deletar conteúdo: {e}")
            return False

    @classmethod
    def _from_dict(cls, data: Dict[str, Any]) -> 'Conteudo':
        """Cria uma instância de Conteudo a partir de um dicionário"""
        return cls(
            id=data.get('id'),
            projeto_id=data.get('projeto_id'),
            identificador=data.get('identificador'),
            tipo_conteudo=data.get('tipo_conteudo'),
            alcance=data.get('alcance'),
            engajamento=data.get('engajamento'),
            valor_gasto=data.get('valor_gasto'),
            cpm=data.get('cpm'),
            seguidores_antes=data.get('seguidores_antes'),
            seguidores_depois=data.get('seguidores_depois'),
            custo_por_seguidor=data.get('custo_por_seguidor'),
            custo_por_engajamento=data.get('custo_por_engajamento'),
            thruplay=data.get('thruplay'),
            frequencia=data.get('frequencia'),
            reproducao_25_pct=data.get('reproducao_25_pct'),
            reproducao_50_pct=data.get('reproducao_50_pct'),
            reproducao_75_pct=data.get('reproducao_75_pct'),
            reproducao_95_pct=data.get('reproducao_95_pct'),
            reproducao_100_pct=data.get('reproducao_100_pct'),
            data_inicio_impulsionamento=data.get('data_inicio_impulsionamento'),
            data_fim_impulsionamento=data.get('data_fim_impulsionamento'),
            data_criacao=data.get('data_criacao'),
            data_atualizacao=data.get('data_atualizacao'),
            ativo=data.get('ativo', True)
        )

    def to_dict(self) -> Dict[str, Any]:
        """Converte o conteúdo para dicionário"""
        return {
            'id': self.id,
            'projeto_id': self.projeto_id,
            'identificador': self.identificador,
            'tipo_conteudo': self.tipo_conteudo,
            'alcance': self.alcance,
            'engajamento': self.engajamento,
            'valor_gasto': self.valor_gasto,
            'cpm': self.cpm,
            'seguidores_antes': self.seguidores_antes,
            'seguidores_depois': self.seguidores_depois,
            'custo_por_seguidor': self.custo_por_seguidor,
            'custo_por_engajamento': self.custo_por_engajamento,
            'thruplay': self.thruplay,
            'frequencia': self.frequencia,
            'reproducao_25_pct': self.reproducao_25_pct,
            'reproducao_50_pct': self.reproducao_50_pct,
            'reproducao_75_pct': self.reproducao_75_pct,
            'reproducao_95_pct': self.reproducao_95_pct,
            'reproducao_100_pct': self.reproducao_100_pct,
            'data_inicio_impulsionamento': self.data_inicio_impulsionamento.isoformat() if self.data_inicio_impulsionamento else None,
            'data_fim_impulsionamento': self.data_fim_impulsionamento.isoformat() if self.data_fim_impulsionamento else None,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'data_atualizacao': self.data_atualizacao.isoformat() if self.data_atualizacao else None,
            'ativo': self.ativo
        }


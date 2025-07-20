from flask import Blueprint, request, jsonify
from datetime import datetime, date
from src.models.campanha import Campanha

campanha_bp = Blueprint('campanha', __name__)

@campanha_bp.route('/campanhas', methods=['GET'])
def listar_campanhas():
    """Lista campanhas por projeto e tipo"""
    try:
        projeto_id = request.args.get('projeto_id')
        tipo_campanha = request.args.get('tipo_campanha')
        
        if not projeto_id:
            return jsonify({
                'success': False,
                'error': 'projeto_id é obrigatório'
            }), 400
        
        campanhas = Campanha.listar_por_projeto(projeto_id, tipo_campanha)
        return jsonify({
            'success': True,
            'data': [campanha.to_dict() for campanha in campanhas]
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@campanha_bp.route('/campanhas', methods=['POST'])
def criar_campanha():
    """Cria uma nova campanha"""
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ['projeto_id', 'nome', 'tipo_campanha']):
            return jsonify({
                'success': False,
                'error': 'projeto_id, nome e tipo_campanha são obrigatórios'
            }), 400
        
        # Prepara dados opcionais
        kwargs = {}
        for campo in ['engajamento_total', 'custo_por_engajamento', 'alcance_total',
                     'thruplay_total', 'frequencia_media', 'valor_gasto_total',
                     'reproducao_25_pct_total', 'reproducao_50_pct_total',
                     'reproducao_75_pct_total', 'reproducao_95_pct_total',
                     'reproducao_100_pct_total']:
            if campo in data and data[campo] is not None:
                kwargs[campo] = data[campo]
        
        # Converte datas
        for campo_data in ['data_inicio', 'data_fim']:
            if campo_data in data and data[campo_data]:
                try:
                    kwargs[campo_data] = datetime.strptime(data[campo_data], '%Y-%m-%d').date()
                except ValueError:
                    return jsonify({
                        'success': False,
                        'error': f'Formato de data inválido para {campo_data}. Use YYYY-MM-DD'
                    }), 400
        
        campanha = Campanha.criar(
            projeto_id=data['projeto_id'],
            nome=data['nome'],
            tipo_campanha=data['tipo_campanha'],
            objetivo=data.get('objetivo'),
            **kwargs
        )
        
        if campanha:
            return jsonify({
                'success': True,
                'data': campanha.to_dict()
            }), 201
        else:
            return jsonify({
                'success': False,
                'error': 'Erro ao criar campanha'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@campanha_bp.route('/campanhas/<campanha_id>', methods=['GET'])
def buscar_campanha(campanha_id):
    """Busca uma campanha pelo ID"""
    try:
        campanha = Campanha.buscar_por_id(campanha_id)
        
        if campanha:
            return jsonify({
                'success': True,
                'data': campanha.to_dict()
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Campanha não encontrada'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@campanha_bp.route('/campanhas/<campanha_id>', methods=['PUT'])
def atualizar_campanha(campanha_id):
    """Atualiza uma campanha"""
    try:
        data = request.get_json()
        campanha = Campanha.buscar_por_id(campanha_id)
        
        if not campanha:
            return jsonify({
                'success': False,
                'error': 'Campanha não encontrada'
            }), 404
        
        # Prepara dados para atualização
        kwargs = {}
        for campo in ['nome', 'tipo_campanha', 'objetivo', 'engajamento_total',
                     'custo_por_engajamento', 'alcance_total', 'thruplay_total',
                     'frequencia_media', 'valor_gasto_total', 'reproducao_25_pct_total',
                     'reproducao_50_pct_total', 'reproducao_75_pct_total',
                     'reproducao_95_pct_total', 'reproducao_100_pct_total']:
            if campo in data:
                kwargs[campo] = data[campo]
        
        # Converte datas
        for campo_data in ['data_inicio', 'data_fim']:
            if campo_data in data and data[campo_data]:
                try:
                    kwargs[campo_data] = datetime.strptime(data[campo_data], '%Y-%m-%d').date()
                except ValueError:
                    return jsonify({
                        'success': False,
                        'error': f'Formato de data inválido para {campo_data}. Use YYYY-MM-DD'
                    }), 400
        
        sucesso = campanha.atualizar(**kwargs)
        
        if sucesso:
            return jsonify({
                'success': True,
                'data': campanha.to_dict()
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Erro ao atualizar campanha'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@campanha_bp.route('/campanhas/<campanha_id>', methods=['DELETE'])
def deletar_campanha(campanha_id):
    """Deleta uma campanha (soft delete)"""
    try:
        campanha = Campanha.buscar_por_id(campanha_id)
        
        if not campanha:
            return jsonify({
                'success': False,
                'error': 'Campanha não encontrada'
            }), 404
        
        sucesso = campanha.deletar()
        
        if sucesso:
            return jsonify({
                'success': True,
                'message': 'Campanha deletada com sucesso'
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Erro ao deletar campanha'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@campanha_bp.route('/campanhas/<campanha_id>/conteudos', methods=['GET'])
def listar_conteudos_campanha(campanha_id):
    """Lista conteúdos associados à campanha"""
    try:
        campanha = Campanha.buscar_por_id(campanha_id)
        
        if not campanha:
            return jsonify({
                'success': False,
                'error': 'Campanha não encontrada'
            }), 404
        
        conteudos = campanha.listar_conteudos()
        
        return jsonify({
            'success': True,
            'data': conteudos
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@campanha_bp.route('/campanhas/<campanha_id>/conteudos', methods=['POST'])
def associar_conteudo_campanha(campanha_id):
    """Associa um conteúdo à campanha"""
    try:
        data = request.get_json()
        
        if not data or 'conteudo_id' not in data:
            return jsonify({
                'success': False,
                'error': 'conteudo_id é obrigatório'
            }), 400
        
        campanha = Campanha.buscar_por_id(campanha_id)
        
        if not campanha:
            return jsonify({
                'success': False,
                'error': 'Campanha não encontrada'
            }), 404
        
        sucesso = campanha.associar_conteudo(data['conteudo_id'])
        
        if sucesso:
            return jsonify({
                'success': True,
                'message': 'Conteúdo associado com sucesso'
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Erro ao associar conteúdo'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@campanha_bp.route('/campanhas/<campanha_id>/conteudos/<conteudo_id>', methods=['DELETE'])
def desassociar_conteudo_campanha(campanha_id, conteudo_id):
    """Remove a associação de um conteúdo da campanha"""
    try:
        campanha = Campanha.buscar_por_id(campanha_id)
        
        if not campanha:
            return jsonify({
                'success': False,
                'error': 'Campanha não encontrada'
            }), 404
        
        sucesso = campanha.desassociar_conteudo(conteudo_id)
        
        if sucesso:
            return jsonify({
                'success': True,
                'message': 'Conteúdo desassociado com sucesso'
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Erro ao desassociar conteúdo'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


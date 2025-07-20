from flask import Blueprint, request, jsonify
from datetime import datetime, date
from src.models.conteudo import Conteudo

conteudo_bp = Blueprint('conteudo', __name__)

@conteudo_bp.route('/conteudos', methods=['GET'])
def listar_conteudos():
    """Lista conteúdos por projeto e tipo"""
    try:
        projeto_id = request.args.get('projeto_id')
        tipo_conteudo = request.args.get('tipo_conteudo')
        
        if not projeto_id:
            return jsonify({
                'success': False,
                'error': 'projeto_id é obrigatório'
            }), 400
        
        conteudos = Conteudo.listar_por_projeto(projeto_id, tipo_conteudo)
        return jsonify({
            'success': True,
            'data': [conteudo.to_dict() for conteudo in conteudos]
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@conteudo_bp.route('/conteudos', methods=['POST'])
def criar_conteudo():
    """Cria um novo conteúdo"""
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ['projeto_id', 'identificador', 'tipo_conteudo']):
            return jsonify({
                'success': False,
                'error': 'projeto_id, identificador e tipo_conteudo são obrigatórios'
            }), 400
        
        # Converte datas se fornecidas
        kwargs = {}
        for campo in ['alcance', 'engajamento', 'valor_gasto', 'cpm', 'seguidores_antes',
                     'seguidores_depois', 'thruplay', 'frequencia', 'reproducao_25_pct',
                     'reproducao_50_pct', 'reproducao_75_pct', 'reproducao_95_pct',
                     'reproducao_100_pct']:
            if campo in data and data[campo] is not None:
                kwargs[campo] = data[campo]
        
        # Converte datas
        for campo_data in ['data_inicio_impulsionamento', 'data_fim_impulsionamento']:
            if campo_data in data and data[campo_data]:
                try:
                    kwargs[campo_data] = datetime.strptime(data[campo_data], '%Y-%m-%d').date()
                except ValueError:
                    return jsonify({
                        'success': False,
                        'error': f'Formato de data inválido para {campo_data}. Use YYYY-MM-DD'
                    }), 400
        
        conteudo = Conteudo.criar(
            projeto_id=data['projeto_id'],
            identificador=data['identificador'],
            tipo_conteudo=data['tipo_conteudo'],
            **kwargs
        )
        
        if conteudo:
            return jsonify({
                'success': True,
                'data': conteudo.to_dict()
            }), 201
        else:
            return jsonify({
                'success': False,
                'error': 'Erro ao criar conteúdo'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@conteudo_bp.route('/conteudos/<conteudo_id>', methods=['GET'])
def buscar_conteudo(conteudo_id):
    """Busca um conteúdo pelo ID"""
    try:
        conteudo = Conteudo.buscar_por_id(conteudo_id)
        
        if conteudo:
            return jsonify({
                'success': True,
                'data': conteudo.to_dict()
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Conteúdo não encontrado'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@conteudo_bp.route('/conteudos/<conteudo_id>', methods=['PUT'])
def atualizar_conteudo(conteudo_id):
    """Atualiza um conteúdo"""
    try:
        data = request.get_json()
        conteudo = Conteudo.buscar_por_id(conteudo_id)
        
        if not conteudo:
            return jsonify({
                'success': False,
                'error': 'Conteúdo não encontrado'
            }), 404
        
        # Prepara dados para atualização
        kwargs = {}
        for campo in ['identificador', 'tipo_conteudo', 'alcance', 'engajamento', 'valor_gasto',
                     'cpm', 'seguidores_antes', 'seguidores_depois', 'thruplay', 'frequencia',
                     'reproducao_25_pct', 'reproducao_50_pct', 'reproducao_75_pct',
                     'reproducao_95_pct', 'reproducao_100_pct']:
            if campo in data:
                kwargs[campo] = data[campo]
        
        # Converte datas
        for campo_data in ['data_inicio_impulsionamento', 'data_fim_impulsionamento']:
            if campo_data in data and data[campo_data]:
                try:
                    kwargs[campo_data] = datetime.strptime(data[campo_data], '%Y-%m-%d').date()
                except ValueError:
                    return jsonify({
                        'success': False,
                        'error': f'Formato de data inválido para {campo_data}. Use YYYY-MM-DD'
                    }), 400
        
        sucesso = conteudo.atualizar(**kwargs)
        
        if sucesso:
            return jsonify({
                'success': True,
                'data': conteudo.to_dict()
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Erro ao atualizar conteúdo'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@conteudo_bp.route('/conteudos/<conteudo_id>', methods=['DELETE'])
def deletar_conteudo(conteudo_id):
    """Deleta um conteúdo (soft delete)"""
    try:
        conteudo = Conteudo.buscar_por_id(conteudo_id)
        
        if not conteudo:
            return jsonify({
                'success': False,
                'error': 'Conteúdo não encontrado'
            }), 404
        
        sucesso = conteudo.deletar()
        
        if sucesso:
            return jsonify({
                'success': True,
                'message': 'Conteúdo deletado com sucesso'
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Erro ao deletar conteúdo'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@conteudo_bp.route('/conteudos/melhores-criativos', methods=['GET'])
def listar_melhores_criativos():
    """Lista os melhores criativos por tipo"""
    try:
        data_inicio_str = request.args.get('data_inicio')
        data_fim_str = request.args.get('data_fim')
        
        data_inicio = None
        data_fim = None
        
        if data_inicio_str:
            try:
                data_inicio = datetime.strptime(data_inicio_str, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({
                    'success': False,
                    'error': 'Formato de data_inicio inválido. Use YYYY-MM-DD'
                }), 400
        
        if data_fim_str:
            try:
                data_fim = datetime.strptime(data_fim_str, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({
                    'success': False,
                    'error': 'Formato de data_fim inválido. Use YYYY-MM-DD'
                }), 400
        
        melhores = Conteudo.listar_melhores_criativos(data_inicio, data_fim)
        
        # Converte para dicionário
        resultado = {}
        for tipo, conteudos in melhores.items():
            resultado[tipo] = [conteudo.to_dict() for conteudo in conteudos]
        
        return jsonify({
            'success': True,
            'data': resultado
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


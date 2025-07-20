from flask import Blueprint, request, jsonify
from src.models.projeto import Projeto

projeto_bp = Blueprint('projeto', __name__)

@projeto_bp.route('/projetos', methods=['GET'])
def listar_projetos():
    """Lista todos os projetos"""
    try:
        projetos = Projeto.listar_todos()
        return jsonify({
            'success': True,
            'data': [projeto.to_dict() for projeto in projetos]
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@projeto_bp.route('/projetos', methods=['POST'])
def criar_projeto():
    """Cria um novo projeto"""
    try:
        data = request.get_json()
        
        if not data or not data.get('nome'):
            return jsonify({
                'success': False,
                'error': 'Nome do projeto é obrigatório'
            }), 400
        
        projeto = Projeto.criar(
            nome=data['nome'],
            descricao=data.get('descricao'),
            projecao_gasto_mensal=data.get('projecao_gasto_mensal')
        )
        
        if projeto:
            return jsonify({
                'success': True,
                'data': projeto.to_dict()
            }), 201
        else:
            return jsonify({
                'success': False,
                'error': 'Erro ao criar projeto'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@projeto_bp.route('/projetos/<projeto_id>', methods=['GET'])
def buscar_projeto(projeto_id):
    """Busca um projeto pelo ID"""
    try:
        projeto = Projeto.buscar_por_id(projeto_id)
        
        if projeto:
            return jsonify({
                'success': True,
                'data': projeto.to_dict()
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Projeto não encontrado'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@projeto_bp.route('/projetos/<projeto_id>', methods=['PUT'])
def atualizar_projeto(projeto_id):
    """Atualiza um projeto"""
    try:
        data = request.get_json()
        projeto = Projeto.buscar_por_id(projeto_id)
        
        if not projeto:
            return jsonify({
                'success': False,
                'error': 'Projeto não encontrado'
            }), 404
        
        sucesso = projeto.atualizar(
            nome=data.get('nome'),
            descricao=data.get('descricao'),
            projecao_gasto_mensal=data.get('projecao_gasto_mensal')
        )
        
        if sucesso:
            return jsonify({
                'success': True,
                'data': projeto.to_dict()
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Erro ao atualizar projeto'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@projeto_bp.route('/projetos/<projeto_id>', methods=['DELETE'])
def deletar_projeto(projeto_id):
    """Deleta um projeto (soft delete)"""
    try:
        projeto = Projeto.buscar_por_id(projeto_id)
        
        if not projeto:
            return jsonify({
                'success': False,
                'error': 'Projeto não encontrado'
            }), 404
        
        sucesso = projeto.deletar()
        
        if sucesso:
            return jsonify({
                'success': True,
                'message': 'Projeto deletado com sucesso'
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Erro ao deletar projeto'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


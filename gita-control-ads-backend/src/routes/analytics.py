from flask import Blueprint, request, jsonify
from datetime import datetime, date
from src.models.conteudo import Conteudo
from src.models.campanha import Campanha
from src.models.projeto import Projeto

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/analytics/sugestoes', methods=['POST'])
def gerar_sugestoes():
    """Gera sugestões de melhorias baseadas nas métricas fornecidas"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'Dados não fornecidos'
            }), 400
        
        projeto_id = data.get('projeto_id')
        tipo_analise = data.get('tipo_analise', 'geral')  # 'geral', 'conteudo', 'campanha'
        
        sugestoes = []
        
        if tipo_analise == 'geral' or tipo_analise == 'conteudo':
            # Análise de conteúdos
            conteudos = Conteudo.listar_por_projeto(projeto_id) if projeto_id else []
            sugestoes.extend(_analisar_conteudos(conteudos))
        
        if tipo_analise == 'geral' or tipo_analise == 'campanha':
            # Análise de campanhas
            campanhas = Campanha.listar_por_projeto(projeto_id) if projeto_id else []
            sugestoes.extend(_analisar_campanhas(campanhas))
        
        return jsonify({
            'success': True,
            'data': {
                'sugestoes': sugestoes,
                'total_sugestoes': len(sugestoes),
                'data_analise': datetime.now().isoformat()
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def _analisar_conteudos(conteudos):
    """Analisa conteúdos e gera sugestões específicas"""
    sugestoes = []
    
    if not conteudos:
        return sugestoes
    
    # Separar por tipo
    conteudos_c1 = [c for c in conteudos if c.tipo_conteudo == 'C1']
    conteudos_c2_c4 = [c for c in conteudos if c.tipo_conteudo in ['C2', 'C3', 'C4']]
    
    # Análise C1 (Custo por Seguidor)
    if conteudos_c1:
        custos_seguidor = [c.custo_por_seguidor for c in conteudos_c1 if c.custo_por_seguidor]
        
        if custos_seguidor:
            custo_medio = sum(custos_seguidor) / len(custos_seguidor)
            custo_alto = [c for c in conteudos_c1 if c.custo_por_seguidor and c.custo_por_seguidor > custo_medio * 1.5]
            
            if custo_alto:
                sugestoes.append({
                    'tipo': 'otimizacao',
                    'categoria': 'C1 - Custo por Seguidor',
                    'prioridade': 'alta',
                    'titulo': 'Conteúdos C1 com custo por seguidor elevado',
                    'descricao': f'Identificamos {len(custo_alto)} conteúdo(s) C1 com custo por seguidor acima da média ({custo_medio:.2f}). Considere revisar o targeting, criativo ou orçamento.',
                    'conteudos_afetados': [c.identificador for c in custo_alto],
                    'acao_recomendada': 'Revisar targeting, testar novos criativos ou ajustar orçamento diário'
                })
            
            # Identificar melhores performers
            melhor_custo = min(custos_seguidor)
            melhores = [c for c in conteudos_c1 if c.custo_por_seguidor == melhor_custo]
            
            if melhores:
                sugestoes.append({
                    'tipo': 'oportunidade',
                    'categoria': 'C1 - Melhores Práticas',
                    'prioridade': 'media',
                    'titulo': 'Replicar estratégia dos melhores conteúdos C1',
                    'descricao': f'O conteúdo "{melhores[0].identificador}" tem o melhor custo por seguidor (R$ {melhor_custo:.2f}). Considere replicar elementos deste criativo.',
                    'conteudos_afetados': [c.identificador for c in melhores],
                    'acao_recomendada': 'Analisar elementos visuais, copy e targeting dos melhores performers'
                })
    
    # Análise C2-C4 (Custo por Engajamento)
    if conteudos_c2_c4:
        custos_engajamento = [c.custo_por_engajamento for c in conteudos_c2_c4 if c.custo_por_engajamento]
        
        if custos_engajamento:
            custo_medio_eng = sum(custos_engajamento) / len(custos_engajamento)
            custo_alto_eng = [c for c in conteudos_c2_c4 if c.custo_por_engajamento and c.custo_por_engajamento > custo_medio_eng * 1.3]
            
            if custo_alto_eng:
                sugestoes.append({
                    'tipo': 'otimizacao',
                    'categoria': 'C2-C4 - Custo por Engajamento',
                    'prioridade': 'alta',
                    'titulo': 'Conteúdos de nutrição com custo por engajamento elevado',
                    'descricao': f'Identificamos {len(custo_alto_eng)} conteúdo(s) de nutrição com custo por engajamento acima da média (R$ {custo_medio_eng:.2f}).',
                    'conteudos_afetados': [c.identificador for c in custo_alto_eng],
                    'acao_recomendada': 'Revisar relevância do conteúdo para a audiência e testar novos formatos'
                })
    
    # Análise de reprodução de vídeo (C2-C4)
    conteudos_video = [c for c in conteudos_c2_c4 if c.reproducao_25_pct and c.reproducao_100_pct]
    
    if conteudos_video:
        for conteudo in conteudos_video:
            if conteudo.reproducao_25_pct > 0:
                taxa_retencao = (conteudo.reproducao_100_pct / conteudo.reproducao_25_pct) * 100
                
                if taxa_retencao < 30:  # Baixa retenção
                    sugestoes.append({
                        'tipo': 'otimizacao',
                        'categoria': 'Retenção de Vídeo',
                        'prioridade': 'media',
                        'titulo': f'Baixa retenção no vídeo "{conteudo.identificador}"',
                        'descricao': f'Taxa de retenção de apenas {taxa_retencao:.1f}%. Muitos usuários não assistem até o final.',
                        'conteudos_afetados': [conteudo.identificador],
                        'acao_recomendada': 'Revisar hook inicial, ritmo do vídeo e call-to-action'
                    })
    
    return sugestoes

def _analisar_campanhas(campanhas):
    """Analisa campanhas e gera sugestões específicas"""
    sugestoes = []
    
    if not campanhas:
        return sugestoes
    
    # Análise de frequência
    campanhas_alta_freq = [c for c in campanhas if c.frequencia_media and c.frequencia_media > 3.0]
    
    if campanhas_alta_freq:
        sugestoes.append({
            'tipo': 'alerta',
            'categoria': 'Frequência de Exibição',
            'prioridade': 'alta',
            'titulo': 'Campanhas com frequência muito alta',
            'descricao': f'{len(campanhas_alta_freq)} campanha(s) com frequência acima de 3.0. Risco de fadiga da audiência.',
            'conteudos_afetados': [c.nome for c in campanhas_alta_freq],
            'acao_recomendada': 'Expandir audiência ou pausar temporariamente para evitar saturação'
        })
    
    # Análise de custo por engajamento
    custos_eng_campanhas = [c.custo_por_engajamento for c in campanhas if c.custo_por_engajamento]
    
    if custos_eng_campanhas:
        custo_medio = sum(custos_eng_campanhas) / len(custos_eng_campanhas)
        campanhas_caras = [c for c in campanhas if c.custo_por_engajamento and c.custo_por_engajamento > custo_medio * 1.5]
        
        if campanhas_caras:
            sugestoes.append({
                'tipo': 'otimizacao',
                'categoria': 'Eficiência de Campanha',
                'prioridade': 'media',
                'titulo': 'Campanhas com baixa eficiência de engajamento',
                'descricao': f'{len(campanhas_caras)} campanha(s) com custo por engajamento acima da média (R$ {custo_medio:.2f}).',
                'conteudos_afetados': [c.nome for c in campanhas_caras],
                'acao_recomendada': 'Revisar segmentação de audiência e otimizar criativos'
            })
    
    # Análise de ThruPlay
    campanhas_thruplay = [c for c in campanhas if c.thruplay_total and c.alcance_total]
    
    if campanhas_thruplay:
        for campanha in campanhas_thruplay:
            taxa_thruplay = (campanha.thruplay_total / campanha.alcance_total) * 100
            
            if taxa_thruplay < 15:  # Baixa taxa de ThruPlay
                sugestoes.append({
                    'tipo': 'otimizacao',
                    'categoria': 'Engajamento de Vídeo',
                    'prioridade': 'media',
                    'titulo': f'Baixa taxa de ThruPlay na campanha "{campanha.nome}"',
                    'descricao': f'Taxa de ThruPlay de apenas {taxa_thruplay:.1f}%. O conteúdo pode não estar capturando atenção.',
                    'conteudos_afetados': [campanha.nome],
                    'acao_recomendada': 'Testar novos hooks, formatos de vídeo ou ajustar duração'
                })
    
    return sugestoes

@analytics_bp.route('/analytics/metricas-projeto/<projeto_id>', methods=['GET'])
def obter_metricas_projeto(projeto_id):
    """Obtém métricas consolidadas de um projeto"""
    try:
        projeto = Projeto.buscar_por_id(projeto_id)
        
        if not projeto:
            return jsonify({
                'success': False,
                'error': 'Projeto não encontrado'
            }), 404
        
        # Buscar conteúdos e campanhas
        conteudos = Conteudo.listar_por_projeto(projeto_id)
        campanhas = Campanha.listar_por_projeto(projeto_id)
        
        # Calcular métricas consolidadas
        metricas = {
            'projeto': projeto.to_dict(),
            'resumo': {
                'total_conteudos': len(conteudos),
                'total_campanhas': len(campanhas),
                'conteudos_por_tipo': {
                    'C1': len([c for c in conteudos if c.tipo_conteudo == 'C1']),
                    'C2': len([c for c in conteudos if c.tipo_conteudo == 'C2']),
                    'C3': len([c for c in conteudos if c.tipo_conteudo == 'C3']),
                    'C4': len([c for c in conteudos if c.tipo_conteudo == 'C4'])
                }
            },
            'metricas_c1': _calcular_metricas_c1(conteudos),
            'metricas_c2_c4': _calcular_metricas_c2_c4(conteudos),
            'metricas_campanhas': _calcular_metricas_campanhas(campanhas)
        }
        
        return jsonify({
            'success': True,
            'data': metricas
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def _calcular_metricas_c1(conteudos):
    """Calcula métricas específicas para conteúdos C1"""
    conteudos_c1 = [c for c in conteudos if c.tipo_conteudo == 'C1']
    
    if not conteudos_c1:
        return None
    
    total_gasto = sum([c.valor_gasto for c in conteudos_c1 if c.valor_gasto]) or 0
    total_seguidores_ganhos = sum([
        (c.seguidores_depois - c.seguidores_antes) 
        for c in conteudos_c1 
        if c.seguidores_antes and c.seguidores_depois
    ]) or 0
    
    custos_seguidor = [c.custo_por_seguidor for c in conteudos_c1 if c.custo_por_seguidor]
    
    return {
        'total_gasto': total_gasto,
        'total_seguidores_ganhos': total_seguidores_ganhos,
        'custo_por_seguidor_medio': sum(custos_seguidor) / len(custos_seguidor) if custos_seguidor else 0,
        'melhor_custo_por_seguidor': min(custos_seguidor) if custos_seguidor else 0,
        'pior_custo_por_seguidor': max(custos_seguidor) if custos_seguidor else 0
    }

def _calcular_metricas_c2_c4(conteudos):
    """Calcula métricas específicas para conteúdos C2-C4"""
    conteudos_c2_c4 = [c for c in conteudos if c.tipo_conteudo in ['C2', 'C3', 'C4']]
    
    if not conteudos_c2_c4:
        return None
    
    total_gasto = sum([c.valor_gasto for c in conteudos_c2_c4 if c.valor_gasto]) or 0
    total_engajamento = sum([c.engajamento for c in conteudos_c2_c4 if c.engajamento]) or 0
    
    custos_engajamento = [c.custo_por_engajamento for c in conteudos_c2_c4 if c.custo_por_engajamento]
    
    return {
        'total_gasto': total_gasto,
        'total_engajamento': total_engajamento,
        'custo_por_engajamento_medio': sum(custos_engajamento) / len(custos_engajamento) if custos_engajamento else 0,
        'melhor_custo_por_engajamento': min(custos_engajamento) if custos_engajamento else 0,
        'pior_custo_por_engajamento': max(custos_engajamento) if custos_engajamento else 0
    }

def _calcular_metricas_campanhas(campanhas):
    """Calcula métricas específicas para campanhas"""
    if not campanhas:
        return None
    
    total_gasto = sum([c.valor_gasto_total for c in campanhas if c.valor_gasto_total]) or 0
    total_engajamento = sum([c.engajamento_total for c in campanhas if c.engajamento_total]) or 0
    total_alcance = sum([c.alcance_total for c in campanhas if c.alcance_total]) or 0
    
    return {
        'total_campanhas': len(campanhas),
        'total_gasto': total_gasto,
        'total_engajamento': total_engajamento,
        'total_alcance': total_alcance,
        'campanhas_por_tipo': {
            'C2': len([c for c in campanhas if c.tipo_campanha == 'C2']),
            'C3': len([c for c in campanhas if c.tipo_campanha == 'C3']),
            'C4': len([c for c in campanhas if c.tipo_campanha == 'C4'])
        }
    }


import os
from supabase import create_client, Client

# Configurações do Supabase
SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://bepkixkvoxekafvuyxks.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlcGtpeGt2b3hla2FmdnV5eGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NjQ3MzQsImV4cCI6MjA2MjI0MDczNH0.67es9w2SCE7yUBYGLaEiTc2tUiiPk9-G8M0UeCdaOcw')

def get_supabase_client() -> Client:
    """
    Retorna uma instância do cliente Supabase
    """
    return create_client(SUPABASE_URL, SUPABASE_KEY)

# Cliente global para uso em toda a aplicação
supabase: Client = get_supabase_client()


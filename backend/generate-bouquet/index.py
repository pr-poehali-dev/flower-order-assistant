import json
import os
import requests

def handler(event: dict, context) -> dict:
    """Генерирует изображение букета по описанию через FLUX AI"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        prompt = body.get('prompt', '')
        flower_names = body.get('flower_names', [])
        
        if not prompt and not flower_names:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Prompt or flower names required'})
            }
        
        full_prompt = f"Beautiful flower bouquet, professional photography, white background"
        
        if flower_names:
            flowers_text = ", ".join(flower_names)
            full_prompt += f", flowers: {flowers_text}"
        
        if prompt:
            full_prompt += f", style: {prompt}"
        
        api_key = os.environ.get('AJEPNA9GE1SS323J6E1D', '')
        if not api_key:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'API key not configured'})
            }
        
        api_url = "https://queue.fal.run/fal-ai/flux/schnell"
        response = requests.post(
            api_url,
            json={
                'prompt': full_prompt,
                'image_size': 'square_hd',
                'num_inference_steps': 4,
                'num_images': 1
            },
            headers={
                'Authorization': f'Key {api_key}',
                'Content-Type': 'application/json'
            },
            timeout=60
        )
        
        if response.status_code != 200:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': f'API error: {response.text}'})
            }
        
        result = response.json()
        images = result.get('images', [])
        if not images:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'No image generated'})
            }
        
        image_url = images[0].get('url', '')
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'image_url': image_url,
                'prompt': full_prompt
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }
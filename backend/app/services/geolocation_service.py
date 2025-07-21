import requests

def get_country_from_coordinates(lat, lon):
    url = f"https://nominatim.openstreetmap.org/reverse"
    params = {
        'lat': lat,
        'lon': lon,
        'format': 'json',
        'zoom': 5,
        'addressdetails': 1
    }
    headers = {'User-Agent': 'reboisconnect-app'}

    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data.get('address', {}).get('country')
    except requests.RequestException:
        return None

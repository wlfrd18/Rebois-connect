from app import create_app

def print_routes(app):
    print("Available routes:")
    for rule in app.url_map.iter_rules():
        methods = ','.join(sorted(rule.methods))
        print(f"{rule.endpoint:30s} {rule} [{methods}]")
        
app = create_app()

if __name__ == "__main__":
    print_routes(app)
    app.run(debug=True, host="0.0.0.0", port=5000)
